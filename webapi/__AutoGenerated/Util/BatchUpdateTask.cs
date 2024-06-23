namespace Katchly {
    using System.Text.Json;

    public class BatchUpdateTask : BackgroundTask<BatchUpdateFeature.Parameter> {
        public override string BatchTypeId => "NIJO-BATCH-UPDATE";

        public override string GetJobName(BatchUpdateFeature.Parameter param) {
            return $"一括アップデート（全{param.Items.Count}件）";
        }

        public override IEnumerable<string> ValidateParameter(BatchUpdateFeature.Parameter parameter) {
            BatchUpdateFeature.TryCreate(parameter, out var _, out var errors);
            foreach (var error in errors) {
                yield return error;
            }
        }

        public override void Execute(JobChainWithParameter<BatchUpdateFeature.Parameter> job) {
            job.Section("更新処理実行", context => {
                if (!BatchUpdateFeature.TryCreate(context.Parameter, out var command, out var errors)) {
                    throw new InvalidOperationException($"パラメータが不正です。{Environment.NewLine}{string.Join(Environment.NewLine, errors)}");
                }

                using var tran = context.DbContext.Database.BeginTransaction();
                try {
                    if (!command.Execute(context.AppSrv, out var errors2)) {
                        throw new InvalidOperationException($"一括更新に失敗しました。{Environment.NewLine}{string.Join(Environment.NewLine, errors2)}");
                    }
                    tran.Commit();

                } catch {
                    tran.Rollback();
                    throw;
                }
            });
        }
    }
}
