using System.Text;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Katchly {
    /// <summary>
    /// 自動生成された検索機能や登録機能を上書きする場合はこのクラス内でそのメソッドやプロパティをoverrideしてください。
    /// </summary>
    public partial class OverridedApplicationService : AutoGeneratedApplicationService {
        public OverridedApplicationService(IServiceProvider serviceProvider) : base(serviceProvider) { }

        #region ROW
        protected override void OnRowCreating(IBeforeCreateEventArgs<RowCreateCommand> arg) {
            var now = DateTime.Now;
            arg.Data.CreatedOn = now;
            arg.Data.UpdatedOn = now;
            foreach (var attr in arg.Data.Attrs ?? []) {
                attr.UpdatedOn = now;
            }

            DbContext.LogDbSet.Add(new LogDbEntity {
                ID = Guid.NewGuid().ToString(),
                UpdatedObject = "Row",
                RowIdOrRowTypeId = arg.Data.ID,
                UpdateType = "INS",
                LogTime = now,
                Content = arg.Data.ToJson(),
            });
        }
        protected override void OnRowUpdating(IBeforeUpdateEventArgs<RowSaveCommand> arg) {
            var now = DateTime.Now;
            arg.After.CreateUser = arg.Before.CreateUser;
            arg.After.CreatedOn = arg.Before.CreatedOn;
            arg.After.UpdatedOn = now;
            foreach (var after in arg.After.Attrs ?? []) {
                var before = arg.Before.Attrs?.SingleOrDefault(b => b.ColType?.ColumnId == after.ColType?.ColumnId);
                if (before == null || after.Value != before.Value) {
                    after.UpdatedOn = now;
                }
            }

            DbContext.LogDbSet.Add(new LogDbEntity {
                ID = Guid.NewGuid().ToString(),
                UpdatedObject = "Row",
                RowIdOrRowTypeId = arg.After.ID,
                UpdateType = "UPD",
                LogTime = now,
                Content = arg.After.ToJson(),
            });
        }
        protected override void OnRowDeleting(IBeforeDeleteEventArgs<RowSaveCommand> arg) {
            var now = DateTime.Now;

            DbContext.LogDbSet.Add(new LogDbEntity {
                ID = Guid.NewGuid().ToString(),
                UpdatedObject = "Row",
                RowIdOrRowTypeId = arg.Data.ID,
                UpdateType = "DEL",
                LogTime = now,
                Content = arg.Data.ToJson(),
            });
        }
        #endregion ROW

        #region ROW TYPE
        protected override void OnRowTypeCreating(IBeforeCreateEventArgs<RowTypeCreateCommand> arg) {
            var now = DateTime.Now;
            arg.Data.CreatedOn = now;
            arg.Data.UpdatedOn = now;

            DbContext.LogDbSet.Add(new LogDbEntity {
                ID = Guid.NewGuid().ToString(),
                UpdatedObject = "RowType",
                RowIdOrRowTypeId = arg.Data.ID,
                UpdateType = "INS",
                LogTime = now,
                Content = arg.Data.ToJson(),
            });
        }
        protected override void OnRowTypeUpdating(IBeforeUpdateEventArgs<RowTypeSaveCommand> arg) {
            var now = DateTime.Now;
            arg.After.CreateUser = arg.Before.CreateUser;
            arg.After.CreatedOn = arg.Before.CreatedOn;
            arg.After.UpdatedOn = now;

            DbContext.LogDbSet.Add(new LogDbEntity {
                ID = Guid.NewGuid().ToString(),
                UpdatedObject = "RowType",
                RowIdOrRowTypeId = arg.After.ID,
                UpdateType = "UPD",
                LogTime = now,
                Content = arg.After.ToJson(),
            });
        }
        protected override void OnRowTypeDeleting(IBeforeDeleteEventArgs<RowTypeSaveCommand> arg) {
            var now = DateTime.Now;

            DbContext.LogDbSet.Add(new LogDbEntity {
                ID = Guid.NewGuid().ToString(),
                UpdatedObject = "RowType",
                RowIdOrRowTypeId = arg.Data.ID,
                UpdateType = "DEL",
                LogTime = now,
                Content = arg.Data.ToJson(),
            });
        }
        #endregion ROW TYPE
    }
}