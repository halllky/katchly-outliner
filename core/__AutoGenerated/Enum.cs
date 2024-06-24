namespace Katchly {
    using System.ComponentModel.DataAnnotations;

    public enum ColumnValueType {
        Text = 0,
        RefSingle = 1,
        RefMultiple = 2,
    }
    public enum E_BackgroundTaskState {
        WaitToStart = 0,
        Running = 1,
        Success = 2,
        Fault = 3,
    }
}
