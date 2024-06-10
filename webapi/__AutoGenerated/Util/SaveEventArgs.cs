namespace Katchly {

    #region 更新前イベント引数
    public interface IBeforeSaveEventArg {
        /// <summary>
        /// 更新処理を実行してもよいかどうかをユーザーに問いかけるメッセージを追加します。
        /// ボタンの意味を統一してユーザーが混乱しないようにするため、
        /// 「はい(Yes)」を選択したときに処理が続行され、
        /// 「いいえ(No)」を選択したときに処理が中断されるような文言にしてください。
        /// </summary>
        void AddConfirm(string message);

        /// <summary>
        /// trueの場合、 <see cref="AddConfirm" /> による警告があっても更新処理が続行されます。
        /// 画面側で警告に対して「はい(Yes)」が選択されたあとのリクエストではこの値がtrueになります。
        /// </summary>
        bool IgnoreConfirm { get; }

        /// <summary>
        /// エラーを追加します。更新処理は実行されなくなります。
        /// </summary>
        /// <param name="key">UI上で強調表示されるメンバーへのパス。HTMLのformのnameのルールに従ってください。</param>
        void AddError(string key, string message);
    }
    public interface IBeforeCreateEventArgs<TSaveCommand> : IBeforeSaveEventArg {
        /// <summary>作成されるデータ</summary>
        TSaveCommand Data { get; }
    }
    public interface IBeforeUpdateEventArgs<TSaveCommand> : IBeforeSaveEventArg {
        /// <summary>更新前データ</summary>
        TSaveCommand Before { get; }
        /// <summary>更新後データ</summary>
        TSaveCommand After { get; }
    }
    public interface IBeforeDeleteEventArgs<TSaveCommand> : IBeforeSaveEventArg {
        /// <summary>削除されるデータ</summary>
        TSaveCommand Data { get; }
    }
    #endregion 更新前イベント引数

    #region 更新後イベント引数
    public interface IAfterCreateEventArgs<TSaveCommand> {
        /// <summary>作成されたデータ</summary>
        TSaveCommand Created { get; }
    }
    public interface IAfterUpdateEventArgs<TSaveCommand> {
        /// <summary>更新前データ</summary>
        TSaveCommand BeforeUpdate { get; }
        /// <summary>更新後データ</summary>
        TSaveCommand AfterUpdate { get; }
    }
    public interface IAfterDeleteEventArgs<TSaveCommand> {
        /// <summary>削除されたデータ</summary>
        TSaveCommand Deleted { get; }
    }
    #endregion 更新後イベント引数
}
