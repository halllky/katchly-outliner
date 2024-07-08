namespace Katchly {

    /// <summary>
    /// 一括更新処理
    /// </summary>
    public class BatchUpdateFeature {
        /// <summary>
        /// 一括更新パラメータ
        /// </summary>
        public class Parameter {
            public List<ParameterItem> Items { get; set; } = new();
        }

        /// <summary>
        /// 一括更新パラメータの更新データ1件
        /// </summary>
        public class ParameterItem {
            /// <summary>
            /// 更新データ種別名。以下のうちいずれか:
            /// RowType, Row, RowOrder, Comment, ChangeLog
            /// </summary>
            public string? DataType { get; set; }
            /// <summary>
            /// 新規追加か更新か削除か
            /// </summary>
            public E_ActionType? Action { get; set; }
            /// <summary>
            /// 更新データ。以下のクラスのうちいずれか:
            /// <see cref="RowTypeSaveCommand"/>
            /// <see cref="RowSaveCommand"/>
            /// <see cref="RowOrderSaveCommand"/>
            /// <see cref="CommentSaveCommand"/>
            /// <see cref="ChangeLogSaveCommand"/>
            /// </summary>
            public object? Data { get; set; }
        }

        public enum E_ActionType {
            /// <summary>新規作成</summary>
            ADD,
            /// <summary>更新</summary>
            MOD,
            /// <summary>削除</summary>
            DEL,
        }

        /// <summary>
        /// 一括更新パラメータの内容を検証し、実行コマンドのインスタンスを返します。
        /// </summary>
        public static bool TryCreate(Parameter parameter, out BatchUpdateFeature command, out ICollection<string> errors) {

            // パラメータを各種データクラスに変換してリストに格納する
            var allItems = new List<ParameterItem>(parameter.Items);
            errors = new List<string>();

            var insertRowType = new List<RowTypeCreateCommand>();
            var updateRowType = new List<RowTypeSaveCommand>();
            var deleteRowType = new List<RowTypeSaveCommand>();
            var insertRow = new List<RowCreateCommand>();
            var updateRow = new List<RowSaveCommand>();
            var deleteRow = new List<RowSaveCommand>();
            var insertRowOrder = new List<RowOrderCreateCommand>();
            var updateRowOrder = new List<RowOrderSaveCommand>();
            var deleteRowOrder = new List<RowOrderSaveCommand>();
            var insertComment = new List<CommentCreateCommand>();
            var updateComment = new List<CommentSaveCommand>();
            var deleteComment = new List<CommentSaveCommand>();
            var insertChangeLog = new List<ChangeLogCreateCommand>();
            var updateChangeLog = new List<ChangeLogSaveCommand>();
            var deleteChangeLog = new List<ChangeLogSaveCommand>();

            var i = 0;
            while (allItems.Count > 0) {
                var item = allItems.First();
                allItems.RemoveAt(0);

                if (item.DataType == "RowType") {
                    if (item.Action == E_ActionType.ADD) {
                        if (Util.TryParseAsObjectType<RowTypeCreateCommand>(item.Data, out var parsed))
                            insertRowType.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowTypeデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.MOD) {
                        if (Util.TryParseAsObjectType<RowTypeSaveCommand>(item.Data, out var parsed))
                            updateRowType.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowTypeデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.DEL) {
                        if (Util.TryParseAsObjectType<RowTypeSaveCommand>(item.Data, out var parsed))
                            deleteRowType.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowTypeデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else {
                        errors.Add($"{i + 1}件目:\t更新種別が不正です。");
                    }

                } else if (item.DataType == "Row") {
                    if (item.Action == E_ActionType.ADD) {
                        if (Util.TryParseAsObjectType<RowCreateCommand>(item.Data, out var parsed))
                            insertRow.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.MOD) {
                        if (Util.TryParseAsObjectType<RowSaveCommand>(item.Data, out var parsed))
                            updateRow.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.DEL) {
                        if (Util.TryParseAsObjectType<RowSaveCommand>(item.Data, out var parsed))
                            deleteRow.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else {
                        errors.Add($"{i + 1}件目:\t更新種別が不正です。");
                    }

                } else if (item.DataType == "RowOrder") {
                    if (item.Action == E_ActionType.ADD) {
                        if (Util.TryParseAsObjectType<RowOrderCreateCommand>(item.Data, out var parsed))
                            insertRowOrder.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowOrderデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.MOD) {
                        if (Util.TryParseAsObjectType<RowOrderSaveCommand>(item.Data, out var parsed))
                            updateRowOrder.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowOrderデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.DEL) {
                        if (Util.TryParseAsObjectType<RowOrderSaveCommand>(item.Data, out var parsed))
                            deleteRowOrder.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをRowOrderデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else {
                        errors.Add($"{i + 1}件目:\t更新種別が不正です。");
                    }

                } else if (item.DataType == "Comment") {
                    if (item.Action == E_ActionType.ADD) {
                        if (Util.TryParseAsObjectType<CommentCreateCommand>(item.Data, out var parsed))
                            insertComment.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをCommentデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.MOD) {
                        if (Util.TryParseAsObjectType<CommentSaveCommand>(item.Data, out var parsed))
                            updateComment.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをCommentデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.DEL) {
                        if (Util.TryParseAsObjectType<CommentSaveCommand>(item.Data, out var parsed))
                            deleteComment.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをCommentデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else {
                        errors.Add($"{i + 1}件目:\t更新種別が不正です。");
                    }

                } else if (item.DataType == "ChangeLog") {
                    if (item.Action == E_ActionType.ADD) {
                        if (Util.TryParseAsObjectType<ChangeLogCreateCommand>(item.Data, out var parsed))
                            insertChangeLog.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをChangeLogデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.MOD) {
                        if (Util.TryParseAsObjectType<ChangeLogSaveCommand>(item.Data, out var parsed))
                            updateChangeLog.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをChangeLogデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else if (item.Action == E_ActionType.DEL) {
                        if (Util.TryParseAsObjectType<ChangeLogSaveCommand>(item.Data, out var parsed))
                            deleteChangeLog.Add(parsed);
                        else
                            errors.Add($"{i + 1}件目:\tパラメータをChangeLogデータとして解釈できません => '{item.Data?.ToJson()}'");

                    } else {
                        errors.Add($"{i + 1}件目:\t更新種別が不正です。");
                    }

                } else {
                    errors.Add($"{i + 1}件目:\tデータ種別が不正です。");
                }

                i++;
            }

            command = new BatchUpdateFeature {
                InsertRowType = insertRowType,
                UpdateRowType = updateRowType,
                DeleteRowType = deleteRowType,
                InsertRow = insertRow,
                UpdateRow = updateRow,
                DeleteRow = deleteRow,
                InsertRowOrder = insertRowOrder,
                UpdateRowOrder = updateRowOrder,
                DeleteRowOrder = deleteRowOrder,
                InsertComment = insertComment,
                UpdateComment = updateComment,
                DeleteComment = deleteComment,
                InsertChangeLog = insertChangeLog,
                UpdateChangeLog = updateChangeLog,
                DeleteChangeLog = deleteChangeLog,
            };
            return errors.Count == 0;
        }

        /// <summary>
        /// 複数の集約データを一括更新します。
        /// トランザクションの開始と終了は行わないため、このメソッドを呼ぶ側で制御してください。
        /// </summary>
        public bool Execute(AutoGeneratedApplicationService applicationService, out ICollection<string> errors) {
            // データ間の依存関係に注意しつつ順番に処理する。
            // 1. 依存する側のデータの削除
            // 2. 依存される側のデータの削除
            // 3. 依存される側のデータの更新
            // 4. 依存される側のデータの新規作成
            // 5. 依存する側のデータの更新
            // 6. 依存する側のデータの新規作成
            errors = new List<string>();
            ICollection<string> errors2;

            foreach (var item in DeleteChangeLog) {
                if (!applicationService.DeleteChangeLog(item, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in DeleteComment) {
                if (!applicationService.DeleteComment(item, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in DeleteRowOrder) {
                if (!applicationService.DeleteRowOrder(item, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in DeleteRow) {
                if (!applicationService.DeleteRow(item, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in DeleteRowType) {
                if (!applicationService.DeleteRowType(item, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in UpdateRowType) {
                if (!applicationService.UpdateRowType(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in InsertRowType) {
                if (!applicationService.CreateRowType(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in UpdateRow) {
                if (!applicationService.UpdateRow(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in InsertRow) {
                if (!applicationService.CreateRow(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in UpdateRowOrder) {
                if (!applicationService.UpdateRowOrder(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in InsertRowOrder) {
                if (!applicationService.CreateRowOrder(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in UpdateComment) {
                if (!applicationService.UpdateComment(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in InsertComment) {
                if (!applicationService.CreateComment(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in UpdateChangeLog) {
                if (!applicationService.UpdateChangeLog(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }
            foreach (var item in InsertChangeLog) {
                if (!applicationService.CreateChangeLog(item, out var _, out errors2)) {
                    foreach (var err in errors2) errors.Add(err);
                }
            }

            return errors.Count == 0;
        }

#pragma warning disable CS8618 // null 非許容のフィールドには、コンストラクターの終了時に null 以外の値が入っていなければなりません。Null 許容として宣言することをご検討ください。
        private BatchUpdateFeature() { }
#pragma warning restore CS8618 // null 非許容のフィールドには、コンストラクターの終了時に null 以外の値が入っていなければなりません。Null 許容として宣言することをご検討ください。

        private IReadOnlyList<RowTypeCreateCommand> InsertRowType { get; init; }
        private IReadOnlyList<RowTypeSaveCommand> UpdateRowType { get; init; }
        private IReadOnlyList<RowTypeSaveCommand> DeleteRowType { get; init; }
        private IReadOnlyList<RowCreateCommand> InsertRow { get; init; }
        private IReadOnlyList<RowSaveCommand> UpdateRow { get; init; }
        private IReadOnlyList<RowSaveCommand> DeleteRow { get; init; }
        private IReadOnlyList<RowOrderCreateCommand> InsertRowOrder { get; init; }
        private IReadOnlyList<RowOrderSaveCommand> UpdateRowOrder { get; init; }
        private IReadOnlyList<RowOrderSaveCommand> DeleteRowOrder { get; init; }
        private IReadOnlyList<CommentCreateCommand> InsertComment { get; init; }
        private IReadOnlyList<CommentSaveCommand> UpdateComment { get; init; }
        private IReadOnlyList<CommentSaveCommand> DeleteComment { get; init; }
        private IReadOnlyList<ChangeLogCreateCommand> InsertChangeLog { get; init; }
        private IReadOnlyList<ChangeLogSaveCommand> UpdateChangeLog { get; init; }
        private IReadOnlyList<ChangeLogSaveCommand> DeleteChangeLog { get; init; }
    }
}
