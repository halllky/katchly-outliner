namespace Katchly {
    
    /// <summary>
    /// <see cref="BatchUpdateParameter" /> に静的型がついていないのを補完して使いやすくするためのクラス
    /// </summary>
    public class RowBatchUpdateParameter {
        private readonly List<BatchUpdateData> _data = new();
    
        public RowBatchUpdateParameter Add(RowCreateCommand cmd) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Add, Data = cmd });
            return this;
        }
        public RowBatchUpdateParameter Modify(RowSaveCommand item) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Modify, Data = item });
            return this;
        }
        public RowBatchUpdateParameter Delete(string? ID) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Delete, Data = new object[] { ID } });
            return this;
        }
        public BatchUpdateParameter Build() => new BatchUpdateParameter {
            DataType = "Row",
            Items = _data.ToList(),
        };
    }
    
    /// <summary>
    /// <see cref="BatchUpdateParameter" /> に静的型がついていないのを補完して使いやすくするためのクラス
    /// </summary>
    public class RowOrderBatchUpdateParameter {
        private readonly List<BatchUpdateData> _data = new();
    
        public RowOrderBatchUpdateParameter Add(RowOrderCreateCommand cmd) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Add, Data = cmd });
            return this;
        }
        public RowOrderBatchUpdateParameter Modify(RowOrderSaveCommand item) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Modify, Data = item });
            return this;
        }
        public RowOrderBatchUpdateParameter Delete(string? Row_ID) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Delete, Data = new object[] { Row_ID } });
            return this;
        }
        public BatchUpdateParameter Build() => new BatchUpdateParameter {
            DataType = "RowOrder",
            Items = _data.ToList(),
        };
    }
    
    /// <summary>
    /// <see cref="BatchUpdateParameter" /> に静的型がついていないのを補完して使いやすくするためのクラス
    /// </summary>
    public class RowTypeBatchUpdateParameter {
        private readonly List<BatchUpdateData> _data = new();
    
        public RowTypeBatchUpdateParameter Add(RowTypeCreateCommand cmd) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Add, Data = cmd });
            return this;
        }
        public RowTypeBatchUpdateParameter Modify(RowTypeSaveCommand item) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Modify, Data = item });
            return this;
        }
        public RowTypeBatchUpdateParameter Delete(string? ID) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Delete, Data = new object[] { ID } });
            return this;
        }
        public BatchUpdateParameter Build() => new BatchUpdateParameter {
            DataType = "RowType",
            Items = _data.ToList(),
        };
    }
    
    /// <summary>
    /// <see cref="BatchUpdateParameter" /> に静的型がついていないのを補完して使いやすくするためのクラス
    /// </summary>
    public class LogBatchUpdateParameter {
        private readonly List<BatchUpdateData> _data = new();
    
        public LogBatchUpdateParameter Add(LogCreateCommand cmd) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Add, Data = cmd });
            return this;
        }
        public LogBatchUpdateParameter Modify(LogSaveCommand item) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Modify, Data = item });
            return this;
        }
        public LogBatchUpdateParameter Delete(string? ID) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Delete, Data = new object[] { ID } });
            return this;
        }
        public BatchUpdateParameter Build() => new BatchUpdateParameter {
            DataType = "Log",
            Items = _data.ToList(),
        };
    }
}
