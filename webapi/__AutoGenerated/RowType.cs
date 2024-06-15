namespace Katchly {
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Infrastructure;
    using Katchly;

    [ApiController]
    [Route("api/[controller]")]
    public partial class RowTypeController : ControllerBase {
        public RowTypeController(ILogger<RowTypeController> logger, AutoGeneratedApplicationService applicationService) {
            _logger = logger;
            _applicationService = applicationService;
        }
        protected readonly ILogger<RowTypeController> _logger;
        protected readonly AutoGeneratedApplicationService _applicationService;

        [HttpPost("create")]
        public virtual IActionResult Create([FromBody] RowTypeCreateCommand param) {
            if (_applicationService.CreateRowType(param, out var created, out var errors)) {
                return this.JsonContent(created);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpGet("detail/{ID}")]
        public virtual IActionResult Find(string? ID) {
            if (ID == null) return BadRequest();
            var instance = _applicationService.FindRowType(ID);
            if (instance == null) {
                return NotFound();
            } else {
                return this.JsonContent(instance);
            }
        }
        [HttpPost("update")]
        public virtual IActionResult Update(RowTypeSaveCommand param) {
            if (_applicationService.UpdateRowType(param, out var updated, out var errors)) {
                return this.JsonContent(updated);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpDelete("delete")]
        public virtual IActionResult Delete(RowTypeSaveCommand param) {
            if (_applicationService.DeleteRowType(param, out var errors)) {
                return Ok();
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpPost("load")]
        public virtual IActionResult Load([FromBody]RowTypeSearchCondition? filter, [FromQuery] int? skip, [FromQuery] int? take) {
            var instances = _applicationService.LoadRowType(filter, skip, take);
            return this.JsonContent(instances.ToArray());
        }
        [HttpGet("list-by-keyword")]
        public virtual IActionResult SearchByKeywordx482f568abd9568fda9b360b0bf991835([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordRowType(keyword);
            return this.JsonContent(items);
        }
        [HttpGet("list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8")]
        public virtual IActionResult SearchByKeywordx4411d631bacb9f19ceba5b9461ffdee8([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordColumns(keyword);
            return this.JsonContent(items);
        }
    }


    partial class AutoGeneratedApplicationService {
        public virtual bool CreateRowType(RowTypeCreateCommand command, out RowTypeDisplayData created, out ICollection<string> errors) {
        
            var beforeSaveEventArg = new BeforeCreateEventArgs<RowTypeCreateCommand> {
                Data = command,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnRowTypeCreating(beforeSaveEventArg);
            if (beforeSaveEventArg.Errors.Count > 0) {
                created = new();
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray();
                return false;
            }
            if (beforeSaveEventArg.Confirms.Count > 0) {
                created = new();
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray(); // TODO: ワーニングの仕組みを作る
                return false;
            }
        
            var dbEntity = command.ToDbEntity();
            DbContext.Add(dbEntity);
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                created = new RowTypeDisplayData();
                errors = ex.GetMessagesRecursively("  ").ToList();
                return false;
            }
        
            var afterUpdate = this.FindRowType(dbEntity.ID);
            if (afterUpdate == null) {
                created = new RowTypeDisplayData();
                errors = new[] { "更新後のデータの再読み込みに失敗しました。" };
                return false;
            }
        
            var afterSaveEventArg = new AfterCreateEventArgs<RowTypeCreateCommand>  {
                Created = command,
            };
            OnRowTypeCreated(afterSaveEventArg);
        
            created = afterUpdate;
            errors = new List<string>();
        
            return true;
        }
        
        /// <summary>
        /// RowTypeの新規登録前に実行されます。
        /// エラーチェック、ワーニング、自動算出項目の設定などを行います。
        /// </summary>
        protected virtual void OnRowTypeCreating(IBeforeCreateEventArgs<RowTypeCreateCommand> arg) { }
        /// <summary>
        /// RowTypeの新規登録SQL発効後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnRowTypeCreated(IAfterCreateEventArgs<RowTypeCreateCommand> arg) { }
        
        /// <summary>
        /// RowTypeのキー情報から対象データの詳細を検索して返します。
        /// </summary>
        public virtual RowTypeDisplayData? FindRowType(string? ID) {
        
            var entity = DbContext.RowTypeDbSet
                .AsNoTracking()
                .Include(x => x.Columns)
                .SingleOrDefault(x => x.ID == ID);
        
            if (entity == null) return null;
        
            var aggregateInstance = RowTypeDisplayData.FromDbEntity(entity);
            return aggregateInstance;
        }
        public virtual bool UpdateRowType(RowTypeSaveCommand after, out RowTypeDisplayData updated, out ICollection<string> errors) {
            errors = new List<string>();
        
            var beforeDbEntity = DbContext.RowTypeDbSet
                .AsNoTracking()
                .Include(x => x.Columns)
                .SingleOrDefault(x => x.ID == after.ID);
        
            if (beforeDbEntity == null) {
                updated = new RowTypeDisplayData();
                errors.Add("更新対象のデータが見つかりません。");
                return false;
            }
        
            var beforeUpdate = RowTypeSaveCommand.FromDbEntity(beforeDbEntity);
        
            var beforeSaveEventArg = new BeforeUpdateEventArgs<RowTypeSaveCommand> {
                Before = beforeUpdate,
                After = after,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnRowTypeUpdating(beforeSaveEventArg);
            if (beforeSaveEventArg.Errors.Count > 0) {
                updated = new();
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray();
                return false;
            }
            if (beforeSaveEventArg.Confirms.Count > 0) {
                updated = new();
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray(); // TODO: ワーニングの仕組みを作る
                return false;
            }
        
            var afterDbEntity = after.ToDbEntity();
        
            // Attach
            DbContext.Entry(afterDbEntity).State = EntityState.Modified;
        
            var arr0_before = beforeDbEntity
                .Columns?
                .OfType<ColumnsDbEntity>()
                ?? Enumerable.Empty<ColumnsDbEntity>();
            var arr0_after = afterDbEntity
                .Columns?
                .OfType<ColumnsDbEntity>()
                ?? Enumerable.Empty<ColumnsDbEntity>();
            foreach (var a in arr0_after) {
                var b = arr0_before.SingleOrDefault(b => b.KeyEquals(a));
                if (b == null) {
                    DbContext.Entry(a).State = EntityState.Added;
                } else {
                    DbContext.Entry(a).State = EntityState.Modified;
                }
            }
            foreach (var b in arr0_before) {
                var a = arr0_after.SingleOrDefault(a => a.KeyEquals(b));
                if (a == null) {
                    DbContext.Entry(b).State = EntityState.Deleted;
                }
            }
            
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                updated = new RowTypeDisplayData();
                foreach (var msg in ex.GetMessagesRecursively()) errors.Add(msg);
                return false;
            }
        
            var afterUpdate = this.FindRowType(after.ID);
            if (afterUpdate == null) {
                updated = new RowTypeDisplayData();
                errors.Add("更新後のデータの再読み込みに失敗しました。");
                return false;
            }
        
            var afterSaveEventArg = new AfterUpdateEventArgs<RowTypeSaveCommand> {
                BeforeUpdate = beforeUpdate,
                AfterUpdate = after,
            };
            OnRowTypeUpdated(afterSaveEventArg);
        
            updated = afterUpdate;
            return true;
        }
        
        /// <summary>
        /// RowTypeの更新前に実行されます。
        /// エラーチェック、ワーニング、自動算出項目の設定などを行います。
        /// </summary>
        protected virtual void OnRowTypeUpdating(IBeforeUpdateEventArgs<RowTypeSaveCommand> arg) { }
        /// <summary>
        /// RowTypeの更新SQL発効後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnRowTypeUpdated(IAfterUpdateEventArgs<RowTypeSaveCommand> arg) { }
        
        public virtual bool DeleteRowType(RowTypeSaveCommand data, out ICollection<string> errors) {
        
            var beforeSaveEventArg = new BeforeDeleteEventArgs<RowTypeSaveCommand> {
                Data = data,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnRowTypeDeleting(beforeSaveEventArg);
            if (beforeSaveEventArg.Errors.Count > 0) {
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray();
                return false;
            }
            if (beforeSaveEventArg.Confirms.Count > 0) {
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray(); // TODO: ワーニングの仕組みを作る
                return false;
            }
        
            var entity = DbContext.RowTypeDbSet
                .Include(x => x.Columns)
                .SingleOrDefault(x => x.ID == data.ID);
        
            if (entity == null) {
                errors = new[] { "削除対象のデータが見つかりません。" };
                return false;
            }
        
            var deleted = RowTypeSaveCommand.FromDbEntity(entity);
        
            DbContext.Remove(entity);
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                errors = ex.GetMessagesRecursively().ToArray();
                return false;
            }
        
            var afterSaveEventArg = new AfterDeleteEventArgs<RowTypeSaveCommand> {
                Deleted = deleted,
            };
            OnRowTypeDeleted(afterSaveEventArg);
        
            errors = Array.Empty<string>();
            return true;
        }
        
        /// <summary>
        /// RowTypeの削除前に実行されます。
        /// エラーチェック、ワーニングなどを行います。
        /// </summary>
        protected virtual void OnRowTypeDeleting(IBeforeDeleteEventArgs<RowTypeSaveCommand> arg) { }
        
        /// <summary>
        /// RowTypeの削除SQL発効後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnRowTypeDeleted(IAfterDeleteEventArgs<RowTypeSaveCommand> arg) { }
        
        /// <summary>
        /// RowTypeを検索して返します。
        /// </summary>
        public virtual IEnumerable<RowTypeDisplayData> LoadRowType(RowTypeSearchCondition? filter, int? skip, int? take) {
        
            var query = (IQueryable<RowTypeDbEntity>)DbContext.RowTypeDbSet
                .AsNoTracking()
                .Include(x => x.Columns)
                ;
        
            // 絞り込み
            if (!string.IsNullOrWhiteSpace(filter?.ID)) {
                query = query.Where(x => x.ID == filter.ID);
            }
            if (!string.IsNullOrWhiteSpace(filter?.RowTypeName)) {
                var trimmed = filter.RowTypeName.Trim();
                query = query.Where(x => x.RowTypeName.Contains(trimmed));
            }
            if (filter?.CreatedOn?.From != default) {
                query = query.Where(x => x.CreatedOn >= filter.CreatedOn.From);
            }
            if (filter?.CreatedOn?.To != default) {
                query = query.Where(x => x.CreatedOn <= filter.CreatedOn.To);
            }
            if (!string.IsNullOrWhiteSpace(filter?.CreateUser)) {
                var trimmed = filter.CreateUser.Trim();
                query = query.Where(x => x.CreateUser.Contains(trimmed));
            }
            if (filter?.UpdatedOn?.From != default) {
                query = query.Where(x => x.UpdatedOn >= filter.UpdatedOn.From);
            }
            if (filter?.UpdatedOn?.To != default) {
                query = query.Where(x => x.UpdatedOn <= filter.UpdatedOn.To);
            }
            if (!string.IsNullOrWhiteSpace(filter?.UpdateUser)) {
                var trimmed = filter.UpdateUser.Trim();
                query = query.Where(x => x.UpdateUser.Contains(trimmed));
            }
        
            // 順番
            query = query
                .OrderBy(x => x.ID)
                ;
        
            // ページング
            if (skip != null) query = query.Skip(skip.Value);
            if (take != null) query = query.Take(take.Value);
        
            return query
                .AsEnumerable()
                .Select(entity => RowTypeDisplayData.FromDbEntity(entity));
        }
        /// <summary>
        /// RowTypeをキーワードで検索します。
        /// </summary>
        public virtual IEnumerable<RowTypeRefInfo> SearchByKeywordRowType(string? keyword) {
            var query = (IQueryable<RowTypeDbEntity>)DbContext.RowTypeDbSet;
        
            if (!string.IsNullOrWhiteSpace(keyword)) {
                var like = $"%{keyword.Trim().Replace("%", "\\%")}%";
                query = query.Where(item => EF.Functions.Like(item.ID, like));
            }
        
            var results = query
                .OrderBy(m => m.ID)
                .Take(101)
                .AsEnumerable()
                .Select(entity => RowTypeRefInfo.FromDbEntity(entity));
        
            return results;
        }
        /// <summary>
        /// Columnsをキーワードで検索します。
        /// </summary>
        public virtual IEnumerable<ColumnsRefInfo> SearchByKeywordColumns(string? keyword) {
            var query = (IQueryable<ColumnsDbEntity>)DbContext.ColumnsDbSet;
        
            if (!string.IsNullOrWhiteSpace(keyword)) {
                var like = $"%{keyword.Trim().Replace("%", "\\%")}%";
                query = query.Where(item => EF.Functions.Like(item.Parent.ID, like)
                                         || EF.Functions.Like(item.ColumnId, like));
            }
        
            var results = query
                .OrderBy(m => m.Parent.ID)
                .Take(101)
                .AsEnumerable()
                .Select(entity => ColumnsRefInfo.FromDbEntity(entity));
        
            return results;
        }
    }


#region データ構造クラス
    /// <summary>
    /// RowTypeのデータ作成コマンドです。
    /// </summary>
    public partial class RowTypeCreateCommand {
        public string? ID { get; set; }
        public string? RowTypeName { get; set; }
        public List<ColumnsSaveCommand>? Columns { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreateUser { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdateUser { get; set; }
    
        /// <summary>
        /// RowTypeのオブジェクトをデータベースに保存する形に変換します。
        /// </summary>
        public Katchly.RowTypeDbEntity ToDbEntity() {
            return new Katchly.RowTypeDbEntity {
                ID = this.ID,
                RowTypeName = this.RowTypeName,
                Columns = this.Columns?.Select(item1 => new Katchly.ColumnsDbEntity {
                    Columns_ID = this.ID,
                    ColumnId = item1.ColumnId,
                    ColumnName = item1.ColumnName,
                }).ToHashSet() ?? new HashSet<Katchly.ColumnsDbEntity>(),
                CreatedOn = this.CreatedOn,
                CreateUser = this.CreateUser,
                UpdatedOn = this.UpdatedOn,
                UpdateUser = this.UpdateUser,
            };
        }
    }
    /// <summary>
    /// RowTypeのデータ1件の詳細を表すクラスです。
    /// </summary>
    public partial class RowTypeSaveCommand {
        public string? ID { get; set; }
        public string? RowTypeName { get; set; }
        public List<ColumnsSaveCommand>? Columns { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreateUser { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdateUser { get; set; }
    
        /// <summary>
        /// RowTypeのオブジェクトをデータベースに保存する形に変換します。
        /// </summary>
        public Katchly.RowTypeDbEntity ToDbEntity() {
            return new Katchly.RowTypeDbEntity {
                ID = this.ID,
                RowTypeName = this.RowTypeName,
                Columns = this.Columns?.Select(item1 => new Katchly.ColumnsDbEntity {
                    Columns_ID = this.ID,
                    ColumnId = item1.ColumnId,
                    ColumnName = item1.ColumnName,
                }).ToHashSet() ?? new HashSet<Katchly.ColumnsDbEntity>(),
                CreatedOn = this.CreatedOn,
                CreateUser = this.CreateUser,
                UpdatedOn = this.UpdatedOn,
                UpdateUser = this.UpdateUser,
            };
        }
        /// <summary>
        /// RowTypeのデータベースから取得した内容を画面に表示する形に変換します。
        /// </summary>
        public static RowTypeSaveCommand FromDbEntity(Katchly.RowTypeDbEntity entity) {
            var instance = new RowTypeSaveCommand {
                ID = entity.ID,
                RowTypeName = entity.RowTypeName,
                Columns = entity.Columns?.Select(item => new ColumnsSaveCommand() {
                    ColumnId = item.ColumnId,
                    ColumnName = item.ColumnName,
                }).ToList(),
                CreatedOn = entity.CreatedOn,
                CreateUser = entity.CreateUser,
                UpdatedOn = entity.UpdatedOn,
                UpdateUser = entity.UpdateUser,
            };
            return instance;
        }
    }
    /// <summary>
    /// Columnsのデータ1件の詳細を表すクラスです。
    /// </summary>
    public partial class ColumnsSaveCommand {
        public string? ColumnId { get; set; }
        public string? ColumnName { get; set; }
    
    }
    public class RowTypeSearchCondition {
        public string? ID { get; set; }
        public string? RowTypeName { get; set; }
        public FromTo<DateTime?> CreatedOn { get; set; } = new();
        public string? CreateUser { get; set; }
        public FromTo<DateTime?> UpdatedOn { get; set; } = new();
        public string? UpdateUser { get; set; }
    }
    public class ColumnsSearchCondition {
        public string? ColumnId { get; set; }
        public string? ColumnName { get; set; }
    }
    public class RowTypeKeys {
        [Key]
        public string? ID { get; set; }
    }
    public class ColumnsKeys {
        [Key]
        public RowTypeKeys? Parent { get; set; }
        [Key]
        public string? ColumnId { get; set; }
    }
    /// <summary>
    /// RowTypeのデータベースに保存されるデータの形を表すクラスです。
    /// </summary>
    public partial class RowTypeDbEntity {
        public string? ID { get; set; }
        public string? RowTypeName { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreateUser { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdateUser { get; set; }
    
        public virtual ICollection<ColumnsDbEntity> Columns { get; set; }
        public virtual ICollection<RowDbEntity> RefferedBy_RowDbEntity_RowType { get; set; }
        public virtual ICollection<CommentDbEntity> RefferedBy_CommentDbEntity_TargetRowType { get; set; }
    
        /// <summary>このオブジェクトと比較対象のオブジェクトの主キーが一致するかを返します。</summary>
        public bool KeyEquals(RowTypeDbEntity entity) {
            if (entity.ID != this.ID) return false;
            return true;
        }
    }
    /// <summary>
    /// Columnsのデータベースに保存されるデータの形を表すクラスです。
    /// </summary>
    public partial class ColumnsDbEntity {
        public string? Columns_ID { get; set; }
        public string? ColumnId { get; set; }
        public string? ColumnName { get; set; }
    
        public virtual RowTypeDbEntity? Parent { get; set; }
        public virtual ICollection<AttrsDbEntity> RefferedBy_AttrsDbEntity_ColType { get; set; }
        public virtual ICollection<CommentDbEntity> RefferedBy_CommentDbEntity_TargetColumn { get; set; }
    
        /// <summary>このオブジェクトと比較対象のオブジェクトの主キーが一致するかを返します。</summary>
        public bool KeyEquals(ColumnsDbEntity entity) {
            if (entity.Columns_ID != this.Columns_ID) return false;
            if (entity.ColumnId != this.ColumnId) return false;
            return true;
        }
    }
    /// <summary>
    /// RowTypeの画面表示用データ
    /// </summary>
    public partial class RowTypeDisplayData {
        public string localRepositoryItemKey { get; set; }
        public bool existsInRemoteRepository { get; set; }
        public bool willBeChanged { get; set; }
        public bool willBeDeleted { get; set; }
        public RowTypeDisplayDataOwnMembers own_members { get; set; } = new();
        public List<ColumnsDisplayData> child_Columns { get; set; }
    
        public static RowTypeDisplayData FromDbEntity(RowTypeDbEntity dbEntity) {
            var displayData = new RowTypeDisplayData {
                localRepositoryItemKey = new object?[] { dbEntity.ID }.ToJson(),
                existsInRemoteRepository = true,
                willBeChanged = false,
                willBeDeleted = false,
                own_members = new() {
                    ID = dbEntity?.ID,
                    RowTypeName = dbEntity?.RowTypeName,
                    CreatedOn = dbEntity?.CreatedOn,
                    CreateUser = dbEntity?.CreateUser,
                    UpdatedOn = dbEntity?.UpdatedOn,
                    UpdateUser = dbEntity?.UpdateUser,
                },
                child_Columns = dbEntity?.Columns?.Select(x0 => new ColumnsDisplayData {
                    localRepositoryItemKey = new object?[] { dbEntity.ID, x0?.ColumnId }.ToJson(),
                    existsInRemoteRepository = true,
                    willBeChanged = false,
                    willBeDeleted = false,
                    own_members = new() {
                        ColumnId = x0?.ColumnId,
                        ColumnName = x0?.ColumnName,
                    },
                }).ToList() ?? [],
            };
            return displayData;
        }
    }
    public class RowTypeDisplayDataOwnMembers {
        public string? ID { get; set; }
        public string? RowTypeName { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreateUser { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdateUser { get; set; }
    }
    /// <summary>
    /// Columnsの画面表示用データ
    /// </summary>
    public partial class ColumnsDisplayData {
        public string localRepositoryItemKey { get; set; }
        public bool existsInRemoteRepository { get; set; }
        public bool willBeChanged { get; set; }
        public bool willBeDeleted { get; set; }
        public ColumnsDisplayDataOwnMembers own_members { get; set; } = new();
    }
    public class ColumnsDisplayDataOwnMembers {
        public string? ColumnId { get; set; }
        public string? ColumnName { get; set; }
    }
    
    // ----------------------- RowTypeRefInfo -----------------------
    /// <summary>
    /// RowTypeを参照する他のデータの画面上に表示されるRowTypeのデータ型。
    /// </summary>
    public partial class RowTypeRefInfo {
        /// <summary>
        /// RowTypeのキー。保存するときはこの値が使用される。
        /// 新規作成されてからDBに登録されるまでの間のRowTypeをUUID等の不変の値で参照できるようにするために文字列になっている。
        /// </summary>
        public string? __instanceKey { get; set; }
    
        public string? ID { get; set; }
    
        public static RowTypeRefInfo FromDbEntity(RowTypeDbEntity dbEntity) {
            var instance = new RowTypeRefInfo {
                __instanceKey = new object?[] {
                    dbEntity.ID,
                }.ToJson(),
                ID = dbEntity.ID,
            };
            return instance;
        }
    }
    
    // ----------------------- ColumnsRefInfo -----------------------
    /// <summary>
    /// Columnsを参照する他のデータの画面上に表示されるColumnsのデータ型。
    /// </summary>
    public partial class ColumnsRefInfo {
        /// <summary>
        /// Columnsのキー。保存するときはこの値が使用される。
        /// 新規作成されてからDBに登録されるまでの間のColumnsをUUID等の不変の値で参照できるようにするために文字列になっている。
        /// </summary>
        public string? __instanceKey { get; set; }
    
        public ColumnsRefInfo_Parent? Parent { get; set; }
        public string? ColumnId { get; set; }
    
        public static ColumnsRefInfo FromDbEntity(ColumnsDbEntity dbEntity) {
            var instance = new ColumnsRefInfo {
                __instanceKey = new object?[] {
                    dbEntity.Columns_ID,
                    dbEntity.ColumnId,
                }.ToJson(),
                ColumnId = dbEntity.ColumnId,
            };
            return instance;
        }
    }
    public partial class ColumnsRefInfo_Parent {
        public string? ID { get; set; }
    }
#endregion データ構造クラス
}

namespace Katchly {
    using Katchly;
    using Microsoft.EntityFrameworkCore;

    partial class MyDbContext {
        public virtual DbSet<RowTypeDbEntity> RowTypeDbSet { get; set; }
        public virtual DbSet<ColumnsDbEntity> ColumnsDbSet { get; set; }

        private void OnModelCreating_RowType(ModelBuilder modelBuilder) {
            modelBuilder.Entity<Katchly.RowTypeDbEntity>(entity => {
            
                entity.HasKey(e => new {
                    e.ID,
                });
            
                entity.Property(e => e.ID)
                    .IsRequired(true);
                entity.Property(e => e.RowTypeName)
                    .IsRequired(false);
                entity.Property(e => e.CreatedOn)
                    .IsRequired(false);
                entity.Property(e => e.CreateUser)
                    .IsRequired(false);
                entity.Property(e => e.UpdatedOn)
                    .IsRequired(false);
                entity.Property(e => e.UpdateUser)
                    .IsRequired(false);
            
                entity.HasMany(e => e.Columns)
                    .WithOne(e => e.Parent)
                    .HasForeignKey(e => new {
                        e.Columns_ID,
                    })
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(e => e.RefferedBy_RowDbEntity_RowType)
                    .WithOne(e => e.RowType)
                    .HasForeignKey(e => new {
                        e.RowType_ID,
                    })
                    .OnDelete(DeleteBehavior.NoAction);
                entity.HasMany(e => e.RefferedBy_CommentDbEntity_TargetRowType)
                    .WithOne(e => e.TargetRowType)
                    .HasForeignKey(e => new {
                        e.TargetRowType_ID,
                    })
                    .OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<Katchly.ColumnsDbEntity>(entity => {
            
                entity.HasKey(e => new {
                    e.Columns_ID,
                    e.ColumnId,
                });
            
                entity.Property(e => e.Columns_ID)
                    .IsRequired(true);
                entity.Property(e => e.ColumnId)
                    .IsRequired(true);
                entity.Property(e => e.ColumnName)
                    .IsRequired(false);
            
                entity.HasMany(e => e.RefferedBy_AttrsDbEntity_ColType)
                    .WithOne(e => e.ColType)
                    .HasForeignKey(e => new {
                        e.ColType_Columns_ID,
                        e.ColType_ColumnId,
                    })
                    .OnDelete(DeleteBehavior.NoAction);
                entity.HasMany(e => e.RefferedBy_CommentDbEntity_TargetColumn)
                    .WithOne(e => e.TargetColumn)
                    .HasForeignKey(e => new {
                        e.TargetColumn_Columns_ID,
                        e.TargetColumn_ColumnId,
                    })
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
