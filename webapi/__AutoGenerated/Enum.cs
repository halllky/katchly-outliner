namespace Katchly {
    using System.ComponentModel.DataAnnotations;

    public enum E_BackgroundTaskState {
        WaitToStart = 0,
        Running = 1,
        Success = 2,
        Fault = 3,
    }
    public enum E_Target {
        [Display(Name = "CommentTargetRow")]
        CommentTargetRow = 1,
        [Display(Name = "CommentTargetCell")]
        CommentTargetCell = 2,
        [Display(Name = "CommentTargetRowType")]
        CommentTargetRowType = 3,
        [Display(Name = "CommentTargetColumn")]
        CommentTargetColumn = 4,
        [Display(Name = "CommentTargetComment")]
        CommentTargetComment = 5,
    }
}
