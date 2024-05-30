namespace FlexTree {
    
    /// <summary>
    /// <see cref="BatchUpdateParameter" /> に静的型がついていないのを補完して使いやすくするためのクラス
    /// </summary>
    public class 親集約BatchUpdateParameter {
        private readonly List<BatchUpdateData> _data = new();
    
        public 親集約BatchUpdateParameter Add(親集約CreateCommand cmd) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Add, Data = cmd });
            return this;
        }
        public 親集約BatchUpdateParameter Modify(親集約SaveCommand item) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Modify, Data = item });
            return this;
        }
        public 親集約BatchUpdateParameter Delete(string? ID) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Delete, Data = new object[] { ID } });
            return this;
        }
        public BatchUpdateParameter Build() => new BatchUpdateParameter {
            DataType = "親集約",
            Items = _data.ToList(),
        };
    }
    
    /// <summary>
    /// <see cref="BatchUpdateParameter" /> に静的型がついていないのを補完して使いやすくするためのクラス
    /// </summary>
    public class 参照先BatchUpdateParameter {
        private readonly List<BatchUpdateData> _data = new();
    
        public 参照先BatchUpdateParameter Add(参照先CreateCommand cmd) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Add, Data = cmd });
            return this;
        }
        public 参照先BatchUpdateParameter Modify(参照先SaveCommand item) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Modify, Data = item });
            return this;
        }
        public 参照先BatchUpdateParameter Delete(string? 参照先ID) {
            _data.Add(new BatchUpdateData { Action = E_BatchUpdateAction.Delete, Data = new object[] { 参照先ID } });
            return this;
        }
        public BatchUpdateParameter Build() => new BatchUpdateParameter {
            DataType = "参照先",
            Items = _data.ToList(),
        };
    }
}
