using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Katchly {
    public sealed class BackgroundTaskLauncher : Microsoft.Extensions.Hosting.BackgroundService {

        protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
            var serviceCollection = new ServiceCollection();
            Katchly.DefaultConfiguration.ConfigureServices(serviceCollection);
            var services = serviceCollection.BuildServiceProvider();

            var logger = services.GetRequiredService<ILogger>();
            var settings = services.GetRequiredService<RuntimeSettings.Server>();
            var runningTasks = new Dictionary<string, Task>();

            var directory = Path.Combine(Directory.GetCurrentDirectory(), settings.JobDirectory ?? "job");
            if (!Directory.Exists(directory)) Directory.CreateDirectory(directory);

            stoppingToken.Register(() => {
                logger.LogInformation($"バッチ起動監視処理の中止が要請されました。");
            });

            try {

                logger.LogInformation($"バッチ起動監視 開始");

                while (!stoppingToken.IsCancellationRequested) {
                    // 待機
                    try {
                        await Task.Delay(settings.BackgroundTask.PollingSpanMilliSeconds, stoppingToken);
                    } catch (TaskCanceledException) {
                        continue;
                    }

                    // 終了しているバッチがないか調べる
                    using var pollingScope = services.CreateScope();
                    var dbContext = pollingScope.ServiceProvider.GetRequiredService<Katchly.MyDbContext>();
                    DetectFinishing(runningTasks, dbContext, logger);

                    // 起動対象バッチがあるかどうか検索
                    var queued = dbContext
                        .NIJOBackgroundTaskEntityDbSet
                        .Where(task => task.State == E_BackgroundTaskState.WaitToStart)
                        .OrderBy(task => task.RequestTime)
                        .Take(5)
                        .ToArray();
                    if (!queued.Any()) continue;

                    // バッチ起動
                    var now = DateTime.Now;
                    var contextFactory = new BackgroundTaskContextFactory(now, services, directory);
                    foreach (var entity in queued) {
                        try {
                            var backgroundTask = BackgroundTask.FindTaskByID(entity.BatchType);
                            var executeArgument = CreateExecuteArgument(backgroundTask, entity, contextFactory, stoppingToken);

                            var task = Task.Run(() => {
                                logger.LogInformation("バッチ実行開始 {Id} ({Type} {Name})", entity.JobId, entity.BatchType, entity.Name);
                                backgroundTask.Execute(executeArgument);
                                logger.LogInformation("バッチ実行終了 {Id} ({Type} {Name})", entity.JobId, entity.BatchType, entity.Name);
                            }, CancellationToken.None);
                            runningTasks.Add(entity.JobId, task);

                            entity.StartTime = now;
                            entity.State = E_BackgroundTaskState.Running;
                            dbContext.SaveChanges();

                        } catch (Exception ex) {
                            logger.LogError(ex, "バッチの起動に失敗しました({Id} {Name}): {Message}", entity.JobId, entity.Name, ex.Message);
                        }
                    }
                }
            } catch (Exception ex) {
                logger.LogCritical(ex, "バッチ起動監視処理でエラーが発生しました: {Message}", ex.Message);
            }

            // 起動中ジョブの終了を待機
            try {
                logger.LogInformation("起動中ジョブの終了を待機します。");
                using var disposingScope = services.CreateScope();
                Task.WaitAll(runningTasks.Values.ToArray(), CancellationToken.None);
                var dbContext = disposingScope.ServiceProvider.GetRequiredService<Katchly.MyDbContext>();
                DetectFinishing(runningTasks, dbContext, logger);
            } catch (Exception ex) {
                logger.LogCritical(ex, "バッチ起動監視処理(起動中ジョブの終了待機)でエラーが発生しました: {Message}", ex.Message);
            }

            logger.LogInformation($"バッチ起動監視 終了");
        }

        /// <summary>
        /// ジョブの起動指示をもとに実行用のオブジェクトを作成して返します。
        /// </summary>
        private static JobChain CreateExecuteArgument(BackgroundTask backgroundTask, Katchly.BackgroundTaskEntity entity, BackgroundTaskContextFactory contextFactory, CancellationToken stoppingToken) {
            var type = backgroundTask.GetType();

            while (type != null && type != typeof(object)) {
                // パラメータなしの場合
                if (type == typeof(BackgroundTask)) {
                    return new JobChain(entity.JobId, new(), contextFactory, stoppingToken);
                }
                // パラメータありの場合
                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(BackgroundTask<>)) {
                    var genericType = type.GetGenericArguments()[0];

                    object parsed;
                    try {
                        parsed = Util.EnsureObjectType(entity.ParameterJson, genericType);
                    } catch (JsonException ex) {
                        throw new InvalidOperationException($"バッチID {entity.JobId} のパラメータを {genericType.Name} 型のJSONとして解釈できません。", ex);
                    }

                    var jobChainType = typeof(JobChainWithParameter<>).MakeGenericType(genericType);
                    return (JobChain)Activator.CreateInstance(jobChainType, new object[] {
                        entity.JobId,
                        parsed,
                        new Stack<string>(),
                        contextFactory,
                        stoppingToken,
                    })!;
                }
                type = type.BaseType;
            }

            throw new InvalidOperationException();
        }

        /// <summary>
        /// 終了したタスクを検知して完了情報を記録します。
        /// </summary>
        private void DetectFinishing(Dictionary<string, Task> runningTasks, Katchly.MyDbContext dbContext, ILogger logger) {
            // 終了したバッチを列挙
            var completedTasks = runningTasks
                .Where(kv => kv.Value.IsCompleted)
                .ToDictionary(kv => kv.Key, kv => kv.Value);
            if (!completedTasks.Any()) return;

            // バッチと対応するデータをDBから検索
            var ids = completedTasks.Keys.ToArray();
            var entities = dbContext
                .NIJOBackgroundTaskEntityDbSet
                .Where(e => ids.Contains(e.JobId))
                .ToDictionary(e => e.JobId);
            var list = completedTasks.ToDictionary(
                kv => kv.Key,
                kv => entities.GetValueOrDefault(kv.Key));

            // そのバッチが完了した旨をDBに登録
            var now = DateTime.Now;
            foreach (var item in list) {
                if (item.Value == null) {
                    logger.LogError("タスク {Id} の完了情報の記録に失敗しました", item.Key);
                    continue;
                }
                item.Value.FinishTime = now;
                item.Value.State = completedTasks[item.Key].IsCompletedSuccessfully
                    ? E_BackgroundTaskState.Success
                    : E_BackgroundTaskState.Fault;
                dbContext.SaveChanges();

                runningTasks.Remove(item.Key);
            }
        }
    }
}
