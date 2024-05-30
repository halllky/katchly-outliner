namespace FlexTree {
    using System.ComponentModel.DataAnnotations;

    public enum MyEnum {
        選択肢1 = 0,
        選択肢2 = 1,
        選択肢3 = 2,
    }
    public enum E_BackgroundTaskState {
        WaitToStart = 0,
        Running = 1,
        Success = 2,
        Fault = 3,
    }
}
