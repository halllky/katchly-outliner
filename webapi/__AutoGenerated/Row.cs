﻿namespace Katchly {
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
    public partial class RowController : ControllerBase {
        public RowController(ILogger<RowController> logger, AutoGeneratedApplicationService applicationService) {
            _logger = logger;
            _applicationService = applicationService;
        }
        protected readonly ILogger<RowController> _logger;
        protected readonly AutoGeneratedApplicationService _applicationService;

        [HttpPost("create")]
        public virtual IActionResult Create([FromBody] RowCreateCommand param) {
            if (_applicationService.CreateRow(param, out var created, out var errors)) {
                return this.JsonContent(created);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpGet("detail/{ID}")]
        public virtual IActionResult Find(string? ID) {
            if (ID == null) return BadRequest();
            var instance = _applicationService.FindRow(ID);
            if (instance == null) {
                return NotFound();
            } else {
                return this.JsonContent(instance);
            }
        }
        [HttpPost("update")]
        public virtual IActionResult Update(RowSaveCommand param) {
            if (_applicationService.UpdateRow(param, out var updated, out var errors)) {
                return this.JsonContent(updated);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpDelete("delete")]
        public virtual IActionResult Delete(RowSaveCommand param) {
            if (_applicationService.DeleteRow(param, out var errors)) {
                return Ok();
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpPost("load")]
        public virtual IActionResult Load([FromBody]RowSearchCondition? filter, [FromQuery] int? skip, [FromQuery] int? take) {
            var instances = _applicationService.LoadRow(filter, skip, take);
            return this.JsonContent(instances.ToArray());
        }
        [HttpGet("list-by-keyword")]
        public virtual IActionResult SearchByKeywordxc431ca892f0ec48c9bbc3311bb00c38c([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordRow(keyword);
            return this.JsonContent(items);
        }
        [HttpGet("list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc")]
        public virtual IActionResult SearchByKeywordx218859120e2951a46aa6ad9fb9e627cc([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordAttrs(keyword);
            return this.JsonContent(items);
        }
    }


    partial class AutoGeneratedApplicationService {
        public virtual bool CreateRow(RowCreateCommand command, out RowDisplayData created, out ICollection<string> errors) {
        
            var beforeSaveEventArg = new BeforeCreateEventArgs<RowCreateCommand> {
                Data = command,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnRowCreating(beforeSaveEventArg);
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
                created = new RowDisplayData();
                errors = ex.GetMessagesRecursively("  ").ToList();
                return false;
            }
        
            var afterUpdate = this.FindRow(dbEntity.ID);
            if (afterUpdate == null) {
                created = new RowDisplayData();
                errors = new[] { "更新後のデータの再読み込みに失敗しました。" };
                return false;
            }
        
            var afterSaveEventArg = new AfterCreateEventArgs<RowCreateCommand>  {
                Created = command,
            };
            OnRowCreated(afterSaveEventArg);
        
            created = afterUpdate;
            errors = new List<string>();
        
            return true;
        }
        
        /// <summary>
        /// Rowの新規登録前に実行されます。
        /// エラーチェック、ワーニング、自動算出項目の設定などを行います。
        /// </summary>
        protected virtual void OnRowCreating(IBeforeCreateEventArgs<RowCreateCommand> arg) { }
        /// <summary>
        /// Rowの新規登録SQL発効後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnRowCreated(IAfterCreateEventArgs<RowCreateCommand> arg) { }
        
        /// <summary>
        /// Rowのキー情報から対象データの詳細を検索して返します。
        /// </summary>
        public virtual RowDisplayData? FindRow(string? ID) {
        
            var entity = DbContext.RowDbSet
                .AsNoTracking()
                .Include(x => x.Attrs)
                .Include(x => x.RowType)
                .Include(x => x.Attrs)
                .ThenInclude(x => x.ColType)
                .ThenInclude(x => x.Parent)
                .Include(x => x.Attrs)
                .ThenInclude(x => x.ColType)
                .SingleOrDefault(x => x.ID == ID);
        
            if (entity == null) return null;
        
            var aggregateInstance = RowDisplayData.FromDbEntity(entity);
            return aggregateInstance;
        }
        public virtual bool UpdateRow(RowSaveCommand after, out RowDisplayData updated, out ICollection<string> errors) {
            errors = new List<string>();
        
            var beforeDbEntity = DbContext.RowDbSet
                .AsNoTracking()
                .Include(x => x.Attrs)
                .Include(x => x.RowType)
                .Include(x => x.Attrs)
                .ThenInclude(x => x.ColType)
                .ThenInclude(x => x.Parent)
                .Include(x => x.Attrs)
                .ThenInclude(x => x.ColType)
                .SingleOrDefault(x => x.ID == after.ID);
        
            if (beforeDbEntity == null) {
                updated = new RowDisplayData();
                errors.Add("更新対象のデータが見つかりません。");
                return false;
            }
        
            var beforeUpdate = RowSaveCommand.FromDbEntity(beforeDbEntity);
        
            var beforeSaveEventArg = new BeforeUpdateEventArgs<RowSaveCommand> {
                Before = beforeUpdate,
                After = after,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnRowUpdating(beforeSaveEventArg);
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
                .Attrs?
                .OfType<AttrsDbEntity>()
                ?? Enumerable.Empty<AttrsDbEntity>();
            var arr0_after = afterDbEntity
                .Attrs?
                .OfType<AttrsDbEntity>()
                ?? Enumerable.Empty<AttrsDbEntity>();
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
                updated = new RowDisplayData();
                foreach (var msg in ex.GetMessagesRecursively()) errors.Add(msg);
                return false;
            }
        
            var afterUpdate = this.FindRow(after.ID);
            if (afterUpdate == null) {
                updated = new RowDisplayData();
                errors.Add("更新後のデータの再読み込みに失敗しました。");
                return false;
            }
        
            var afterSaveEventArg = new AfterUpdateEventArgs<RowSaveCommand> {
                BeforeUpdate = beforeUpdate,
                AfterUpdate = after,
            };
            OnRowUpdated(afterSaveEventArg);
        
            updated = afterUpdate;
            return true;
        }
        
        /// <summary>
        /// Rowの更新前に実行されます。
        /// エラーチェック、ワーニング、自動算出項目の設定などを行います。
        /// </summary>
        protected virtual void OnRowUpdating(IBeforeUpdateEventArgs<RowSaveCommand> arg) { }
        /// <summary>
        /// Rowの更新SQL発効後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnRowUpdated(IAfterUpdateEventArgs<RowSaveCommand> arg) { }
        
        public virtual bool DeleteRow(RowSaveCommand data, out ICollection<string> errors) {
        
            var beforeSaveEventArg = new BeforeDeleteEventArgs<RowSaveCommand> {
                Data = data,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnRowDeleting(beforeSaveEventArg);
            if (beforeSaveEventArg.Errors.Count > 0) {
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray();
                return false;
            }
            if (beforeSaveEventArg.Confirms.Count > 0) {
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray(); // TODO: ワーニングの仕組みを作る
                return false;
            }
        
            var entity = DbContext.RowDbSet
                .Include(x => x.Attrs)
                .Include(x => x.RowType)
                .Include(x => x.Attrs)
                .ThenInclude(x => x.ColType)
                .ThenInclude(x => x.Parent)
                .Include(x => x.Attrs)
                .ThenInclude(x => x.ColType)
                .SingleOrDefault(x => x.ID == data.ID);
        
            if (entity == null) {
                errors = new[] { "削除対象のデータが見つかりません。" };
                return false;
            }
        
            var deleted = RowSaveCommand.FromDbEntity(entity);
        
            DbContext.Remove(entity);
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                errors = ex.GetMessagesRecursively().ToArray();
                return false;
            }
        
            var afterSaveEventArg = new AfterDeleteEventArgs<RowSaveCommand> {
                Deleted = deleted,
            };
            OnRowDeleted(afterSaveEventArg);
        
            errors = Array.Empty<string>();
            return true;
        }
        
        /// <summary>
        /// Rowの削除前に実行されます。
        /// エラーチェック、ワーニングなどを行います。
        /// </summary>
        protected virtual void OnRowDeleting(IBeforeDeleteEventArgs<RowSaveCommand> arg) { }
        
        /// <summary>
        /// Rowの削除SQL発効後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnRowDeleted(IAfterDeleteEventArgs<RowSaveCommand> arg) { }
        
        /// <summary>
        /// Rowを検索して返します。
        /// </summary>
        public virtual IEnumerable<RowDisplayData> LoadRow(RowSearchCondition? filter, int? skip, int? take) {
        
            var query = (IQueryable<RowDbEntity>)DbContext.RowDbSet
                .AsNoTracking()
                .Include(x => x.Attrs)
                .Include(x => x.RowType)
                .Include(x => x.Attrs)
                .ThenInclude(x => x.ColType)
                .ThenInclude(x => x.Parent)
                .Include(x => x.Attrs)
                .ThenInclude(x => x.ColType)
                ;
        
            // 絞り込み
            if (!string.IsNullOrWhiteSpace(filter?.ID)) {
                query = query.Where(x => x.ID == filter.ID);
            }
            if (!string.IsNullOrWhiteSpace(filter?.Text)) {
                var trimmed = filter.Text.Trim();
                query = query.Where(x => x.Text.Contains(trimmed));
            }
            if (!string.IsNullOrWhiteSpace(filter?.RowType?.ID)) {
                query = query.Where(x => x.RowType.ID == filter.RowType.ID);
            }
            if (!string.IsNullOrWhiteSpace(filter?.RowType?.RowTypeName)) {
                var trimmed = filter.RowType.RowTypeName.Trim();
                query = query.Where(x => x.RowType.RowTypeName.Contains(trimmed));
            }
            if (filter?.RowType?.CreatedOn?.From != default) {
                query = query.Where(x => x.RowType.CreatedOn >= filter.RowType.CreatedOn.From);
            }
            if (filter?.RowType?.CreatedOn?.To != default) {
                query = query.Where(x => x.RowType.CreatedOn <= filter.RowType.CreatedOn.To);
            }
            if (!string.IsNullOrWhiteSpace(filter?.RowType?.CreateUser)) {
                var trimmed = filter.RowType.CreateUser.Trim();
                query = query.Where(x => x.RowType.CreateUser.Contains(trimmed));
            }
            if (filter?.RowType?.UpdatedOn?.From != default) {
                query = query.Where(x => x.RowType.UpdatedOn >= filter.RowType.UpdatedOn.From);
            }
            if (filter?.RowType?.UpdatedOn?.To != default) {
                query = query.Where(x => x.RowType.UpdatedOn <= filter.RowType.UpdatedOn.To);
            }
            if (!string.IsNullOrWhiteSpace(filter?.RowType?.UpdateUser)) {
                var trimmed = filter.RowType.UpdateUser.Trim();
                query = query.Where(x => x.RowType.UpdateUser.Contains(trimmed));
            }
            if (filter?.Indent?.From != default) {
                query = query.Where(x => x.Indent >= filter.Indent.From);
            }
            if (filter?.Indent?.To != default) {
                query = query.Where(x => x.Indent <= filter.Indent.To);
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
                .Select(entity => RowDisplayData.FromDbEntity(entity));
        }
        /// <summary>
        /// Rowをキーワードで検索します。
        /// </summary>
        public virtual IEnumerable<RowRefInfo> SearchByKeywordRow(string? keyword) {
            var query = (IQueryable<RowDbEntity>)DbContext.RowDbSet;
        
            if (!string.IsNullOrWhiteSpace(keyword)) {
                var like = $"%{keyword.Trim().Replace("%", "\\%")}%";
                query = query.Where(item => EF.Functions.Like(item.ID, like)
                                         || EF.Functions.Like(item.Text, like));
            }
        
            var results = query
                .OrderBy(m => m.ID)
                .Take(101)
                .AsEnumerable()
                .Select(entity => RowRefInfo.FromDbEntity(entity));
        
            return results;
        }
        /// <summary>
        /// Attrsをキーワードで検索します。
        /// </summary>
        public virtual IEnumerable<AttrsRefInfo> SearchByKeywordAttrs(string? keyword) {
            var query = (IQueryable<AttrsDbEntity>)DbContext.AttrsDbSet;
        
            if (!string.IsNullOrWhiteSpace(keyword)) {
                var like = $"%{keyword.Trim().Replace("%", "\\%")}%";
                query = query.Where(item => EF.Functions.Like(item.Parent.ID, like)
                                         || EF.Functions.Like(item.ColType.Parent.ID, like)
                                         || EF.Functions.Like(item.ColType.ColumnId, like)
                                         || EF.Functions.Like(item.Value, like));
            }
        
            var results = query
                .OrderBy(m => m.Parent.ID)
                .Take(101)
                .AsEnumerable()
                .Select(entity => AttrsRefInfo.FromDbEntity(entity));
        
            return results;
        }
    }


#region データ構造クラス
    /// <summary>
    /// Rowのデータ作成コマンドです。
    /// </summary>
    public partial class RowCreateCommand {
        public string? ID { get; set; }
        public string? Text { get; set; }
        public RowTypeKeys? RowType { get; set; }
        public List<AttrsSaveCommand>? Attrs { get; set; }
        public int? Indent { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreateUser { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdateUser { get; set; }
    
        /// <summary>
        /// Rowのオブジェクトをデータベースに保存する形に変換します。
        /// </summary>
        public Katchly.RowDbEntity ToDbEntity() {
            return new Katchly.RowDbEntity {
                ID = this.ID,
                Text = this.Text,
                Attrs = this.Attrs?.Select(item1 => new Katchly.AttrsDbEntity {
                    Attrs_ID = this.ID,
                    Value = item1.Value,
                    UpdatedOn = item1.UpdatedOn,
                    ColType_Columns_ID = item1.ColType?.Parent?.ID,
                    ColType_ColumnId = item1.ColType?.ColumnId,
                }).ToHashSet() ?? new HashSet<Katchly.AttrsDbEntity>(),
                Indent = this.Indent,
                CreatedOn = this.CreatedOn,
                CreateUser = this.CreateUser,
                UpdatedOn = this.UpdatedOn,
                UpdateUser = this.UpdateUser,
                RowType_ID = this.RowType?.ID,
            };
        }
    }
    /// <summary>
    /// Rowのデータ1件の詳細を表すクラスです。
    /// </summary>
    public partial class RowSaveCommand {
        public string? ID { get; set; }
        public string? Text { get; set; }
        public RowTypeKeys? RowType { get; set; }
        public List<AttrsSaveCommand>? Attrs { get; set; }
        public int? Indent { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreateUser { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdateUser { get; set; }
    
        /// <summary>
        /// Rowのオブジェクトをデータベースに保存する形に変換します。
        /// </summary>
        public Katchly.RowDbEntity ToDbEntity() {
            return new Katchly.RowDbEntity {
                ID = this.ID,
                Text = this.Text,
                Attrs = this.Attrs?.Select(item1 => new Katchly.AttrsDbEntity {
                    Attrs_ID = this.ID,
                    Value = item1.Value,
                    UpdatedOn = item1.UpdatedOn,
                    ColType_Columns_ID = item1.ColType?.Parent?.ID,
                    ColType_ColumnId = item1.ColType?.ColumnId,
                }).ToHashSet() ?? new HashSet<Katchly.AttrsDbEntity>(),
                Indent = this.Indent,
                CreatedOn = this.CreatedOn,
                CreateUser = this.CreateUser,
                UpdatedOn = this.UpdatedOn,
                UpdateUser = this.UpdateUser,
                RowType_ID = this.RowType?.ID,
            };
        }
        /// <summary>
        /// Rowのデータベースから取得した内容を画面に表示する形に変換します。
        /// </summary>
        public static RowSaveCommand FromDbEntity(Katchly.RowDbEntity entity) {
            var instance = new RowSaveCommand {
                ID = entity.ID,
                Text = entity.Text,
                RowType = new RowTypeKeys() {
                    ID = entity.RowType?.ID,
                },
                Attrs = entity.Attrs?.Select(item => new AttrsSaveCommand() {
                    ColType = new ColumnsKeys() {
                        Parent = new RowTypeKeys() {
                            ID = item.ColType?.Parent?.ID,
                        },
                        ColumnId = item.ColType?.ColumnId,
                    },
                    Value = item.Value,
                    UpdatedOn = item.UpdatedOn,
                }).ToList(),
                Indent = entity.Indent,
                CreatedOn = entity.CreatedOn,
                CreateUser = entity.CreateUser,
                UpdatedOn = entity.UpdatedOn,
                UpdateUser = entity.UpdateUser,
            };
            return instance;
        }
    }
    /// <summary>
    /// Attrsのデータ1件の詳細を表すクラスです。
    /// </summary>
    public partial class AttrsSaveCommand {
        public ColumnsKeys? ColType { get; set; }
        public string? Value { get; set; }
        public DateTime? UpdatedOn { get; set; }
    
    }
    public class RowSearchCondition {
        public string? ID { get; set; }
        public string? Text { get; set; }
        public Row_RowTypeSearchCondition RowType { get; set; } = new();
        public FromTo<int?> Indent { get; set; } = new();
        public FromTo<DateTime?> CreatedOn { get; set; } = new();
        public string? CreateUser { get; set; }
        public FromTo<DateTime?> UpdatedOn { get; set; } = new();
        public string? UpdateUser { get; set; }
    }
    public class AttrsSearchCondition {
        public Attrs_ColTypeSearchCondition ColType { get; set; } = new();
        public string? Value { get; set; }
        public FromTo<DateTime?> UpdatedOn { get; set; } = new();
    }
    public class Row_RowTypeSearchCondition {
        public string? ID { get; set; }
        public string? RowTypeName { get; set; }
        public FromTo<DateTime?> CreatedOn { get; set; } = new();
        public string? CreateUser { get; set; }
        public FromTo<DateTime?> UpdatedOn { get; set; } = new();
        public string? UpdateUser { get; set; }
    }
    public class Attrs_ColTypeSearchCondition {
        public Attrs_ColType_ParentSearchCondition Parent { get; set; } = new();
        public string? ColumnId { get; set; }
        public string? ColumnName { get; set; }
    }
    public class Attrs_ColType_ParentSearchCondition {
        public string? ID { get; set; }
        public string? RowTypeName { get; set; }
        public FromTo<DateTime?> CreatedOn { get; set; } = new();
        public string? CreateUser { get; set; }
        public FromTo<DateTime?> UpdatedOn { get; set; } = new();
        public string? UpdateUser { get; set; }
    }
    public class RowKeys {
        [Key]
        public string? ID { get; set; }
    }
    public class AttrsKeys {
        [Key]
        public RowKeys? Parent { get; set; }
        [Key]
        public ColumnsKeys? ColType { get; set; }
    }
    /// <summary>
    /// Rowのデータベースに保存されるデータの形を表すクラスです。
    /// </summary>
    public partial class RowDbEntity {
        public string? ID { get; set; }
        public string? Text { get; set; }
        public int? Indent { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreateUser { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdateUser { get; set; }
        public string? RowType_ID { get; set; }
    
        public virtual RowTypeDbEntity? RowType { get; set; }
        public virtual ICollection<AttrsDbEntity> Attrs { get; set; }
        public virtual RowOrderDbEntity? RefferedBy_RowOrderDbEntity_Row { get; set; }
        public virtual ICollection<CommentDbEntity> RefferedBy_CommentDbEntity_TargetRow { get; set; }
    
        /// <summary>このオブジェクトと比較対象のオブジェクトの主キーが一致するかを返します。</summary>
        public bool KeyEquals(RowDbEntity entity) {
            if (entity.ID != this.ID) return false;
            return true;
        }
    }
    /// <summary>
    /// Attrsのデータベースに保存されるデータの形を表すクラスです。
    /// </summary>
    public partial class AttrsDbEntity {
        public string? Attrs_ID { get; set; }
        public string? Value { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? ColType_Columns_ID { get; set; }
        public string? ColType_ColumnId { get; set; }
    
        public virtual RowDbEntity? Parent { get; set; }
        public virtual ColumnsDbEntity? ColType { get; set; }
        public virtual ICollection<CommentDbEntity> RefferedBy_CommentDbEntity_TargetCell { get; set; }
    
        /// <summary>このオブジェクトと比較対象のオブジェクトの主キーが一致するかを返します。</summary>
        public bool KeyEquals(AttrsDbEntity entity) {
            if (entity.Attrs_ID != this.Attrs_ID) return false;
            if (entity.ColType_Columns_ID != this.ColType_Columns_ID) return false;
            if (entity.ColType_ColumnId != this.ColType_ColumnId) return false;
            return true;
        }
    }
    /// <summary>
    /// Rowの画面表示用データ
    /// </summary>
    public partial class RowDisplayData {
        public string localRepositoryItemKey { get; set; }
        public bool existsInRemoteRepository { get; set; }
        public bool willBeChanged { get; set; }
        public bool willBeDeleted { get; set; }
        public RowDisplayDataOwnMembers own_members { get; set; } = new();
        public List<AttrsDisplayData> child_Attrs { get; set; }
        public RowOrderDisplayData? ref_from_Row_RowOrder { get; set; }
    
        public static RowDisplayData FromDbEntity(RowDbEntity dbEntity) {
            var displayData = new RowDisplayData {
                localRepositoryItemKey = new object?[] { dbEntity.ID }.ToJson(),
                existsInRemoteRepository = true,
                willBeChanged = false,
                willBeDeleted = false,
                own_members = new() {
                    ID = dbEntity?.ID,
                    Text = dbEntity?.Text,
                    RowType = new RowTypeRefInfo {
                        __instanceKey = new object?[] {
                            dbEntity?.RowType?.ID,
                        }.ToJson(),
                        ID = dbEntity?.RowType?.ID,
                    },
                    Indent = dbEntity?.Indent,
                    CreatedOn = dbEntity?.CreatedOn,
                    CreateUser = dbEntity?.CreateUser,
                    UpdatedOn = dbEntity?.UpdatedOn,
                    UpdateUser = dbEntity?.UpdateUser,
                },
                child_Attrs = dbEntity?.Attrs?.Select(x0 => new AttrsDisplayData {
                    localRepositoryItemKey = new object?[] { dbEntity.ID, x0?.ColType?.Parent?.ID, x0?.ColType?.ColumnId }.ToJson(),
                    existsInRemoteRepository = true,
                    willBeChanged = false,
                    willBeDeleted = false,
                    own_members = new() {
                        ColType = new ColumnsRefInfo {
                            __instanceKey = new object?[] {
                                x0?.ColType?.Columns_ID,
                                x0?.ColType?.ColumnId,
                            }.ToJson(),
                            ColumnId = x0?.ColType?.ColumnId,
                        },
                        Value = x0?.Value,
                        UpdatedOn = x0?.UpdatedOn,
                    },
                }).ToList() ?? [],
                ref_from_Row_RowOrder = dbEntity?.RefferedBy_RowOrderDbEntity_Row == null
                    ? null
                    : RowOrderDisplayData.FromDbEntity(dbEntity.RefferedBy_RowOrderDbEntity_Row),
            };
            return displayData;
        }
    }
    public class RowDisplayDataOwnMembers {
        public string? ID { get; set; }
        public string? Text { get; set; }
        public RowTypeRefInfo? RowType { get; set; }
        public int? Indent { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreateUser { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdateUser { get; set; }
    }
    /// <summary>
    /// Attrsの画面表示用データ
    /// </summary>
    public partial class AttrsDisplayData {
        public string localRepositoryItemKey { get; set; }
        public bool existsInRemoteRepository { get; set; }
        public bool willBeChanged { get; set; }
        public bool willBeDeleted { get; set; }
        public AttrsDisplayDataOwnMembers own_members { get; set; } = new();
    }
    public class AttrsDisplayDataOwnMembers {
        public ColumnsRefInfo? ColType { get; set; }
        public string? Value { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
    
    // ----------------------- RowRefInfo -----------------------
    /// <summary>
    /// Rowを参照する他のデータの画面上に表示されるRowのデータ型。
    /// </summary>
    public partial class RowRefInfo {
        /// <summary>
        /// Rowのキー。保存するときはこの値が使用される。
        /// 新規作成されてからDBに登録されるまでの間のRowをUUID等の不変の値で参照できるようにするために文字列になっている。
        /// </summary>
        public string? __instanceKey { get; set; }
    
        public string? ID { get; set; }
        public string? Text { get; set; }
    
        public static RowRefInfo FromDbEntity(RowDbEntity dbEntity) {
            var instance = new RowRefInfo {
                __instanceKey = new object?[] {
                    dbEntity.ID,
                }.ToJson(),
                ID = dbEntity.ID,
                Text = dbEntity.Text,
            };
            return instance;
        }
    }
    
    // ----------------------- AttrsRefInfo -----------------------
    /// <summary>
    /// Attrsを参照する他のデータの画面上に表示されるAttrsのデータ型。
    /// </summary>
    public partial class AttrsRefInfo {
        /// <summary>
        /// Attrsのキー。保存するときはこの値が使用される。
        /// 新規作成されてからDBに登録されるまでの間のAttrsをUUID等の不変の値で参照できるようにするために文字列になっている。
        /// </summary>
        public string? __instanceKey { get; set; }
    
        public AttrsRefInfo_Parent? Parent { get; set; }
        public AttrsRefInfo_ColType? ColType { get; set; }
        public string? Value { get; set; }
    
        public static AttrsRefInfo FromDbEntity(AttrsDbEntity dbEntity) {
            var instance = new AttrsRefInfo {
                __instanceKey = new object?[] {
                    dbEntity.Attrs_ID,
                    dbEntity.ColType_Columns_ID,
                    dbEntity.ColType_ColumnId,
                }.ToJson(),
                ColType = new() {
                    ColumnId = dbEntity.ColType?.ColumnId,
                },
                Value = dbEntity.Value,
            };
            return instance;
        }
    }
    public partial class AttrsRefInfo_Parent {
        public string? ID { get; set; }
        public string? Text { get; set; }
    }
    public partial class AttrsRefInfo_ColType {
        public AttrsRefInfo_ColType_Parent? Parent { get; set; }
        public string? ColumnId { get; set; }
    }
    public partial class AttrsRefInfo_ColType_Parent {
        public string? ID { get; set; }
    }
#endregion データ構造クラス
}

namespace Katchly {
    using Katchly;
    using Microsoft.EntityFrameworkCore;

    partial class MyDbContext {
        public virtual DbSet<RowDbEntity> RowDbSet { get; set; }
        public virtual DbSet<AttrsDbEntity> AttrsDbSet { get; set; }

        private void OnModelCreating_Row(ModelBuilder modelBuilder) {
            modelBuilder.Entity<Katchly.RowDbEntity>(entity => {
            
                entity.HasKey(e => new {
                    e.ID,
                });
            
                entity.Property(e => e.ID)
                    .IsRequired(true);
                entity.Property(e => e.Text)
                    .IsRequired(false);
                entity.Property(e => e.Indent)
                    .IsRequired(false);
                entity.Property(e => e.CreatedOn)
                    .IsRequired(false);
                entity.Property(e => e.CreateUser)
                    .IsRequired(false);
                entity.Property(e => e.UpdatedOn)
                    .IsRequired(false);
                entity.Property(e => e.UpdateUser)
                    .IsRequired(false);
                entity.Property(e => e.RowType_ID)
                    .IsRequired(false);
            
                entity.HasMany(e => e.Attrs)
                    .WithOne(e => e.Parent)
                    .HasForeignKey(e => new {
                        e.Attrs_ID,
                    })
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.RefferedBy_RowOrderDbEntity_Row)
                    .WithOne(e => e.Row)
                    .HasForeignKey<RowOrderDbEntity>(e => new {
                        e.Row_ID,
                    })
                    .OnDelete(DeleteBehavior.NoAction);
                entity.HasMany(e => e.RefferedBy_CommentDbEntity_TargetRow)
                    .WithOne(e => e.TargetRow)
                    .HasForeignKey(e => new {
                        e.TargetRow_ID,
                    })
                    .OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<Katchly.AttrsDbEntity>(entity => {
            
                entity.HasKey(e => new {
                    e.Attrs_ID,
                    e.ColType_Columns_ID,
                    e.ColType_ColumnId,
                });
            
                entity.Property(e => e.Attrs_ID)
                    .IsRequired(true);
                entity.Property(e => e.Value)
                    .IsRequired(false);
                entity.Property(e => e.UpdatedOn)
                    .IsRequired(false);
                entity.Property(e => e.ColType_Columns_ID)
                    .IsRequired(true);
                entity.Property(e => e.ColType_ColumnId)
                    .IsRequired(true);
            
                entity.HasMany(e => e.RefferedBy_CommentDbEntity_TargetCell)
                    .WithOne(e => e.TargetCell)
                    .HasForeignKey(e => new {
                        e.TargetCell_Attrs_ID,
                        e.TargetCell_ColType_Columns_ID,
                        e.TargetCell_ColType_ColumnId,
                    })
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
