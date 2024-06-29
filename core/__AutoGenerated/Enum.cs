namespace Katchly {
    using System.ComponentModel.DataAnnotations;

    public enum E_BackgroundTaskState {
        WaitToStart = 0,
        Running = 1,
        Success = 2,
        Fault = 3,
    }
}
