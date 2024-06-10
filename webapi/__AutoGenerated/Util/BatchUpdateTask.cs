namespace Katchly {
    using System.Text.Json;

    public class BatchUpdateParameter {
        public string? DataType { get; set; }
        public List<BatchUpdateData>? Items { get; set; } = new();
    }
    public class BatchUpdateData {
        public E_BatchUpdateAction? Action { get; set; }
        public object? Data { get; set; }
    }
    public enum E_BatchUpdateAction {
        Add,
        Modify,
        Delete,
    }

    public class BatchUpdateTask : BackgroundTask<BatchUpdateParameter> {
        public override string BatchTypeId => "NIJO-BATCH-UPDATE";

        public override string GetJobName(BatchUpdateParameter param) {
            return $"一括アップデート（{param.DataType}）";
        }

        public override IEnumerable<string> ValidateParameter(BatchUpdateParameter parameter) {
            if (parameter.DataType == "Row") yield break;
            if (parameter.DataType == "RowOrder") yield break;
            if (parameter.DataType == "RowType") yield break;
            if (parameter.DataType == "Log") yield break;
            yield return $"識別子 '{parameter.DataType}' と対応する一括更新処理はありません。";
        }

        public override void Execute(JobChainWithParameter<BatchUpdateParameter> job) {
            job.Section("更新処理実行", context => {
                switch (context.Parameter.DataType) {
                    case "Row": BatchUpdateRow(context); break;
                    case "RowOrder": BatchUpdateRowOrder(context); break;
                    case "RowType": BatchUpdateRowType(context); break;
                    case "Log": BatchUpdateLog(context); break;
                    default: throw new InvalidOperationException($"識別子 '{context.Parameter.DataType}' と対応する一括更新処理はありません。");
                }
            });
        }

        private void BatchUpdateRow(BackgroundTaskContext<BatchUpdateParameter> context) {
            if (context.Parameter.Items == null || context.Parameter.Items.Count == 0) {
                context.Logger.LogWarning("パラメータが０件です。");
                return;
            }
            for (int i = 0; i < context.Parameter.Items.Count; i++) {
                using var logScope = context.Logger.BeginScope($"{i + 1}件目");
                try {
                    var item = context.Parameter.Items[i];
                    if (item.Action == null) throw new InvalidOperationException("登録・更新・削除のいずれかを指定してください。");
                    if (item.Data == null) throw new InvalidOperationException("データが空です。");
        
                    using var serviceScope = context.ServiceProvider.CreateScope();
                    var scopedAppSrv = serviceScope.ServiceProvider.GetRequiredService<AutoGeneratedApplicationService>();
        
                    ICollection<string> errors;
                    switch (item.Action) {
                        case E_BatchUpdateAction.Add:
                            var cmd = Util.EnsureObjectType<RowCreateCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowCreateCommand)}型に変換できません。");
                            if (!scopedAppSrv.CreateRow(cmd, out var _, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        case E_BatchUpdateAction.Modify:
                            var updateData = Util.EnsureObjectType<RowSaveCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowSaveCommand)}型に変換できません。");
                            if (!scopedAppSrv.UpdateRow(updateData, out var _, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        case E_BatchUpdateAction.Delete:
                            var deleteData = Util.EnsureObjectType<RowSaveCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowSaveCommand)}型に変換できません。");
                            if (!scopedAppSrv.DeleteRow(deleteData, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        default:
                            throw new InvalidOperationException($"認識できない更新処理種別です: {item.Action}");
                    }
                } catch (Exception ex) {
                    context.Logger.LogError(ex, "更新処理に失敗しました。");
                    continue;
                }
                context.Logger.LogInformation("正常終了");
            }
        }

        private void BatchUpdateRowOrder(BackgroundTaskContext<BatchUpdateParameter> context) {
            if (context.Parameter.Items == null || context.Parameter.Items.Count == 0) {
                context.Logger.LogWarning("パラメータが０件です。");
                return;
            }
            for (int i = 0; i < context.Parameter.Items.Count; i++) {
                using var logScope = context.Logger.BeginScope($"{i + 1}件目");
                try {
                    var item = context.Parameter.Items[i];
                    if (item.Action == null) throw new InvalidOperationException("登録・更新・削除のいずれかを指定してください。");
                    if (item.Data == null) throw new InvalidOperationException("データが空です。");
        
                    using var serviceScope = context.ServiceProvider.CreateScope();
                    var scopedAppSrv = serviceScope.ServiceProvider.GetRequiredService<AutoGeneratedApplicationService>();
        
                    ICollection<string> errors;
                    switch (item.Action) {
                        case E_BatchUpdateAction.Add:
                            var cmd = Util.EnsureObjectType<RowOrderCreateCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowOrderCreateCommand)}型に変換できません。");
                            if (!scopedAppSrv.CreateRowOrder(cmd, out var _, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        case E_BatchUpdateAction.Modify:
                            var updateData = Util.EnsureObjectType<RowOrderSaveCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowOrderSaveCommand)}型に変換できません。");
                            if (!scopedAppSrv.UpdateRowOrder(updateData, out var _, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        case E_BatchUpdateAction.Delete:
                            var deleteData = Util.EnsureObjectType<RowOrderSaveCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowOrderSaveCommand)}型に変換できません。");
                            if (!scopedAppSrv.DeleteRowOrder(deleteData, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        default:
                            throw new InvalidOperationException($"認識できない更新処理種別です: {item.Action}");
                    }
                } catch (Exception ex) {
                    context.Logger.LogError(ex, "更新処理に失敗しました。");
                    continue;
                }
                context.Logger.LogInformation("正常終了");
            }
        }

        private void BatchUpdateRowType(BackgroundTaskContext<BatchUpdateParameter> context) {
            if (context.Parameter.Items == null || context.Parameter.Items.Count == 0) {
                context.Logger.LogWarning("パラメータが０件です。");
                return;
            }
            for (int i = 0; i < context.Parameter.Items.Count; i++) {
                using var logScope = context.Logger.BeginScope($"{i + 1}件目");
                try {
                    var item = context.Parameter.Items[i];
                    if (item.Action == null) throw new InvalidOperationException("登録・更新・削除のいずれかを指定してください。");
                    if (item.Data == null) throw new InvalidOperationException("データが空です。");
        
                    using var serviceScope = context.ServiceProvider.CreateScope();
                    var scopedAppSrv = serviceScope.ServiceProvider.GetRequiredService<AutoGeneratedApplicationService>();
        
                    ICollection<string> errors;
                    switch (item.Action) {
                        case E_BatchUpdateAction.Add:
                            var cmd = Util.EnsureObjectType<RowTypeCreateCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowTypeCreateCommand)}型に変換できません。");
                            if (!scopedAppSrv.CreateRowType(cmd, out var _, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        case E_BatchUpdateAction.Modify:
                            var updateData = Util.EnsureObjectType<RowTypeSaveCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowTypeSaveCommand)}型に変換できません。");
                            if (!scopedAppSrv.UpdateRowType(updateData, out var _, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        case E_BatchUpdateAction.Delete:
                            var deleteData = Util.EnsureObjectType<RowTypeSaveCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(RowTypeSaveCommand)}型に変換できません。");
                            if (!scopedAppSrv.DeleteRowType(deleteData, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        default:
                            throw new InvalidOperationException($"認識できない更新処理種別です: {item.Action}");
                    }
                } catch (Exception ex) {
                    context.Logger.LogError(ex, "更新処理に失敗しました。");
                    continue;
                }
                context.Logger.LogInformation("正常終了");
            }
        }

        private void BatchUpdateLog(BackgroundTaskContext<BatchUpdateParameter> context) {
            if (context.Parameter.Items == null || context.Parameter.Items.Count == 0) {
                context.Logger.LogWarning("パラメータが０件です。");
                return;
            }
            for (int i = 0; i < context.Parameter.Items.Count; i++) {
                using var logScope = context.Logger.BeginScope($"{i + 1}件目");
                try {
                    var item = context.Parameter.Items[i];
                    if (item.Action == null) throw new InvalidOperationException("登録・更新・削除のいずれかを指定してください。");
                    if (item.Data == null) throw new InvalidOperationException("データが空です。");
        
                    using var serviceScope = context.ServiceProvider.CreateScope();
                    var scopedAppSrv = serviceScope.ServiceProvider.GetRequiredService<AutoGeneratedApplicationService>();
        
                    ICollection<string> errors;
                    switch (item.Action) {
                        case E_BatchUpdateAction.Add:
                            var cmd = Util.EnsureObjectType<LogCreateCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(LogCreateCommand)}型に変換できません。");
                            if (!scopedAppSrv.CreateLog(cmd, out var _, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        case E_BatchUpdateAction.Modify:
                            var updateData = Util.EnsureObjectType<LogSaveCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(LogSaveCommand)}型に変換できません。");
                            if (!scopedAppSrv.UpdateLog(updateData, out var _, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        case E_BatchUpdateAction.Delete:
                            var deleteData = Util.EnsureObjectType<LogSaveCommand>(item.Data)
                                ?? throw new InvalidOperationException($"パラメータを{nameof(LogSaveCommand)}型に変換できません。");
                            if (!scopedAppSrv.DeleteLog(deleteData, out errors))
                                throw new InvalidOperationException(string.Join(Environment.NewLine, errors));
                            break;
                        default:
                            throw new InvalidOperationException($"認識できない更新処理種別です: {item.Action}");
                    }
                } catch (Exception ex) {
                    context.Logger.LogError(ex, "更新処理に失敗しました。");
                    continue;
                }
                context.Logger.LogInformation("正常終了");
            }
        }
    }
}
