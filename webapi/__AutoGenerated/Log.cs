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

    /// <summary>
    /// Logに関する Web API 操作を提供する ASP.NET Core のコントローラー
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public partial class LogController : ControllerBase {
        public LogController(ILogger<LogController> logger, AutoGeneratedApplicationService applicationService) {
            _logger = logger;
            _applicationService = applicationService;
        }
        protected readonly ILogger<LogController> _logger;
        protected readonly AutoGeneratedApplicationService _applicationService;

        /// <summary>
        /// 新しいLogを作成する情報を受け取って登録する Web API
        /// </summary>
        [HttpPost("create")]
        public virtual IActionResult Create([FromBody] LogCreateCommand param) {
            if (_applicationService.CreateLog(param, out var created, out var errors)) {
                return this.JsonContent(created);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        /// <summary>
        /// 既存のLogをキーで1件検索する Web API
        /// </summary>
        [HttpGet("detail/{ID}")]
        public virtual IActionResult Find(string? ID) {
            if (ID == null) return BadRequest();
            var instance = _applicationService.FindLog(ID);
            if (instance == null) {
                return NotFound();
            } else {
                return this.JsonContent(instance);
            }
        }
        /// <summary>
        /// 既存のLogを更新する Web API
        /// </summary>
        [HttpPost("update")]
        public virtual IActionResult Update(LogSaveCommand param) {
            if (_applicationService.UpdateLog(param, out var updated, out var errors)) {
                return this.JsonContent(updated);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        /// <summary>
        /// 既存のLogを削除する Web API
        /// </summary>
        [HttpDelete("delete")]
        public virtual IActionResult Delete(LogSaveCommand param) {
            if (_applicationService.DeleteLog(param, out var errors)) {
                return Ok();
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        /// <summary>
        /// 既存のLogを一覧検索する Web API
        /// </summary>
        [HttpPost("load")]
        public virtual IActionResult Load([FromBody]LogSearchCondition? filter, [FromQuery] int? skip, [FromQuery] int? take) {
            var instances = _applicationService.LoadLog(filter, skip, take);
            return this.JsonContent(instances.ToArray());
        }
        /// <summary>
        /// 既存のLogをキーワードで一覧検索する Web API
        /// </summary>
        [HttpGet("list-by-keyword")]
        public virtual IActionResult SearchByKeywordx2be65a1401b75f2cdd8deaec5a04a976([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordLog(keyword);
            return this.JsonContent(items);
        }
    }


    partial class AutoGeneratedApplicationService {
        /// <summary>
        /// 新しいLogを作成する情報を受け取って登録します。
        /// </summary>
        public virtual bool CreateLog(LogCreateCommand command, out LogDisplayData created, out ICollection<string> errors) {
        
            var beforeSaveEventArg = new BeforeCreateEventArgs<LogCreateCommand> {
                Data = command,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnLogCreating(beforeSaveEventArg);
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
                created = new LogDisplayData();
                errors = ex.GetMessagesRecursively("  ").ToList();
                return false;
            }
        
            var afterUpdate = this.FindLog(dbEntity.ID);
            if (afterUpdate == null) {
                created = new LogDisplayData();
                errors = new[] { "更新後のデータの再読み込みに失敗しました。" };
                return false;
            }
        
            var afterSaveEventArg = new AfterCreateEventArgs<LogCreateCommand>  {
                Created = command,
            };
            OnLogCreated(afterSaveEventArg);
        
            created = afterUpdate;
            errors = new List<string>();
        
            return true;
        }
        
        /// <summary>
        /// Logの新規登録前に実行されます。
        /// エラーチェック、ワーニング、自動算出項目の設定などを行います。
        /// </summary>
        protected virtual void OnLogCreating(IBeforeCreateEventArgs<LogCreateCommand> arg) { }
        /// <summary>
        /// Logの新規登録SQL発行後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnLogCreated(IAfterCreateEventArgs<LogCreateCommand> arg) { }
        
        /// <summary>
        /// Logのキー情報から対象データの詳細を検索して返します。
        /// </summary>
        public virtual LogDisplayData? FindLog(string? ID) {
        
            var entity = DbContext.LogDbSet
                .AsNoTracking()
                .SingleOrDefault(x => x.ID == ID);
        
            if (entity == null) return null;
        
            var aggregateInstance = LogDisplayData.FromDbEntity(entity);
            return aggregateInstance;
        }
        /// <summary>
        /// 既存のLogを更新します。
        /// </summary>
        public virtual bool UpdateLog(LogSaveCommand after, out LogDisplayData updated, out ICollection<string> errors) {
            errors = new List<string>();
        
            var beforeDbEntity = DbContext.LogDbSet
                .AsNoTracking()
                .SingleOrDefault(x => x.ID == after.ID);
        
            if (beforeDbEntity == null) {
                updated = new LogDisplayData();
                errors.Add("更新対象のデータが見つかりません。");
                return false;
            }
        
            var beforeUpdate = LogSaveCommand.FromDbEntity(beforeDbEntity);
        
            var beforeSaveEventArg = new BeforeUpdateEventArgs<LogSaveCommand> {
                Before = beforeUpdate,
                After = after,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnLogUpdating(beforeSaveEventArg);
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
        
            
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                updated = new LogDisplayData();
                foreach (var msg in ex.GetMessagesRecursively()) errors.Add(msg);
                return false;
            }
        
            var afterUpdate = this.FindLog(after.ID);
            if (afterUpdate == null) {
                updated = new LogDisplayData();
                errors.Add("更新後のデータの再読み込みに失敗しました。");
                return false;
            }
        
            var afterSaveEventArg = new AfterUpdateEventArgs<LogSaveCommand> {
                BeforeUpdate = beforeUpdate,
                AfterUpdate = after,
            };
            OnLogUpdated(afterSaveEventArg);
        
            updated = afterUpdate;
            return true;
        }
        
        /// <summary>
        /// Logの更新前に実行されます。
        /// エラーチェック、ワーニング、自動算出項目の設定などを行います。
        /// </summary>
        protected virtual void OnLogUpdating(IBeforeUpdateEventArgs<LogSaveCommand> arg) { }
        /// <summary>
        /// Logの更新SQL発行後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnLogUpdated(IAfterUpdateEventArgs<LogSaveCommand> arg) { }
        
        /// <summary>
        /// 既存のLogを削除します。
        /// </summary>
        public virtual bool DeleteLog(LogSaveCommand data, out ICollection<string> errors) {
        
            var beforeSaveEventArg = new BeforeDeleteEventArgs<LogSaveCommand> {
                Data = data,
                IgnoreConfirm = false, // TODO: ワーニングの仕組みを作る
            };
            OnLogDeleting(beforeSaveEventArg);
            if (beforeSaveEventArg.Errors.Count > 0) {
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray();
                return false;
            }
            if (beforeSaveEventArg.Confirms.Count > 0) {
                errors = beforeSaveEventArg.Errors.Select(err => err.Message).ToArray(); // TODO: ワーニングの仕組みを作る
                return false;
            }
        
            var entity = DbContext.LogDbSet
                .SingleOrDefault(x => x.ID == data.ID);
        
            if (entity == null) {
                errors = new[] { "削除対象のデータが見つかりません。" };
                return false;
            }
        
            var deleted = LogSaveCommand.FromDbEntity(entity);
        
            DbContext.Remove(entity);
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                errors = ex.GetMessagesRecursively().ToArray();
                return false;
            }
        
            var afterSaveEventArg = new AfterDeleteEventArgs<LogSaveCommand> {
                Deleted = deleted,
            };
            OnLogDeleted(afterSaveEventArg);
        
            errors = Array.Empty<string>();
            return true;
        }
        
        /// <summary>
        /// Logの削除前に実行されます。
        /// エラーチェック、ワーニングなどを行います。
        /// </summary>
        protected virtual void OnLogDeleting(IBeforeDeleteEventArgs<LogSaveCommand> arg) { }
        
        /// <summary>
        /// Logの削除SQL発行後、コミット前に実行されます。
        /// </summary>
        protected virtual void OnLogDeleted(IAfterDeleteEventArgs<LogSaveCommand> arg) { }
        
        /// <summary>
        /// Logを検索して返します。
        /// </summary>
        public virtual IEnumerable<LogDisplayData> LoadLog(LogSearchCondition? filter, int? skip, int? take) {
        
            var query = (IQueryable<LogDbEntity>)DbContext.LogDbSet
                .AsNoTracking()
                ;
        
            // 絞り込み
            if (!string.IsNullOrWhiteSpace(filter?.ID)) {
                query = query.Where(x => x.ID == filter.ID);
            }
            if (filter?.LogTime?.From != default) {
                query = query.Where(x => x.LogTime >= filter.LogTime.From);
            }
            if (filter?.LogTime?.To != default) {
                query = query.Where(x => x.LogTime <= filter.LogTime.To);
            }
            if (!string.IsNullOrWhiteSpace(filter?.UpdatedObject)) {
                var trimmed = filter.UpdatedObject.Trim();
                query = query.Where(x => x.UpdatedObject.Contains(trimmed));
            }
            if (!string.IsNullOrWhiteSpace(filter?.UpdateType)) {
                var trimmed = filter.UpdateType.Trim();
                query = query.Where(x => x.UpdateType.Contains(trimmed));
            }
            if (!string.IsNullOrWhiteSpace(filter?.RowIdOrRowTypeId)) {
                var trimmed = filter.RowIdOrRowTypeId.Trim();
                query = query.Where(x => x.RowIdOrRowTypeId.Contains(trimmed));
            }
            if (!string.IsNullOrWhiteSpace(filter?.Content)) {
                var trimmed = filter.Content.Trim();
                query = query.Where(x => x.Content.Contains(trimmed));
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
                .Select(entity => LogDisplayData.FromDbEntity(entity));
        }
        /// <summary>
        /// Logをキーワードで検索します。
        /// </summary>
        public virtual IEnumerable<LogRefInfo> SearchByKeywordLog(string? keyword) {
            var query = (IQueryable<LogDbEntity>)DbContext.LogDbSet;
        
            if (!string.IsNullOrWhiteSpace(keyword)) {
                var like = $"%{keyword.Trim().Replace("%", "\\%")}%";
                query = query.Where(item => EF.Functions.Like(item.ID, like)
                                         || EF.Functions.Like(item.Content, like));
            }
        
            var results = query
                .OrderBy(m => m.ID)
                .Take(101)
                .AsEnumerable()
                .Select(entity => LogRefInfo.FromDbEntity(entity));
        
            return results;
        }
    }


#region データ構造クラス
    /// <summary>
    /// Logのデータ作成コマンドです。
    /// </summary>
    public partial class LogCreateCommand {
        public string? ID { get; set; }
        public DateTime? LogTime { get; set; }
        public string? UpdatedObject { get; set; }
        public string? UpdateType { get; set; }
        public string? RowIdOrRowTypeId { get; set; }
        public string? Content { get; set; }
    
        /// <summary>
        /// Logのオブジェクトをデータベースに保存する形に変換します。
        /// </summary>
        public Katchly.LogDbEntity ToDbEntity() {
            return new Katchly.LogDbEntity {
                ID = this.ID,
                LogTime = this.LogTime,
                UpdatedObject = this.UpdatedObject,
                UpdateType = this.UpdateType,
                RowIdOrRowTypeId = this.RowIdOrRowTypeId,
                Content = this.Content,
            };
        }
    }
    /// <summary>
    /// Logの登録・更新・削除用のデータ型
    /// </summary>
    public partial class LogSaveCommand {
        public string? ID { get; set; }
        public DateTime? LogTime { get; set; }
        public string? UpdatedObject { get; set; }
        public string? UpdateType { get; set; }
        public string? RowIdOrRowTypeId { get; set; }
        public string? Content { get; set; }
    
        /// <summary>
        /// Logのオブジェクトをデータベースに保存する形に変換します。
        /// </summary>
        public Katchly.LogDbEntity ToDbEntity() {
            return new Katchly.LogDbEntity {
                ID = this.ID,
                LogTime = this.LogTime,
                UpdatedObject = this.UpdatedObject,
                UpdateType = this.UpdateType,
                RowIdOrRowTypeId = this.RowIdOrRowTypeId,
                Content = this.Content,
            };
        }
        /// <summary>
        /// Logのデータベースから取得した内容を画面に表示する形に変換します。
        /// </summary>
        public static LogSaveCommand FromDbEntity(Katchly.LogDbEntity entity) {
            var instance = new LogSaveCommand {
                ID = entity.ID,
                LogTime = entity.LogTime,
                UpdatedObject = entity.UpdatedObject,
                UpdateType = entity.UpdateType,
                RowIdOrRowTypeId = entity.RowIdOrRowTypeId,
                Content = entity.Content,
            };
            return instance;
        }
    }
    /// <summary>
    /// Logの一覧検索条件
    /// </summary>
    public class LogSearchCondition {
        public string? ID { get; set; }
        public FromTo<DateTime?> LogTime { get; set; } = new();
        public string? UpdatedObject { get; set; }
        public string? UpdateType { get; set; }
        public string? RowIdOrRowTypeId { get; set; }
        public string? Content { get; set; }
    }
    /// <summary>
    /// ほかの集約がLogを参照するときに必要になる、どのLogを指し示すかのキー情報。
    /// </summary>
    public class LogKeys {
        [Key]
        public string? ID { get; set; }
    }
    /// <summary>
    /// Entity Framework Core のルールに則ったLogのデータ型
    /// </summary>
    public partial class LogDbEntity {
        public string? ID { get; set; }
        public DateTime? LogTime { get; set; }
        public string? UpdatedObject { get; set; }
        public string? UpdateType { get; set; }
        public string? RowIdOrRowTypeId { get; set; }
        public string? Content { get; set; }
    
    
        /// <summary>このオブジェクトと比較対象のオブジェクトの主キーが一致するかを返します。</summary>
        public bool KeyEquals(LogDbEntity entity) {
            if (entity.ID != this.ID) return false;
            return true;
        }
    }
    /// <summary>
    /// Logの画面表示用データ
    /// </summary>
    public partial class LogDisplayData {
        public string localRepositoryItemKey { get; set; }
        public bool existsInRemoteRepository { get; set; }
        public bool willBeChanged { get; set; }
        public bool willBeDeleted { get; set; }
        public LogDisplayDataOwnMembers own_members { get; set; } = new();
    
        public static LogDisplayData FromDbEntity(LogDbEntity dbEntity) {
            var displayData = new LogDisplayData {
                localRepositoryItemKey = new object?[] { dbEntity.ID }.ToJson(),
                existsInRemoteRepository = true,
                willBeChanged = false,
                willBeDeleted = false,
                own_members = new() {
                    ID = dbEntity?.ID,
                    LogTime = dbEntity?.LogTime,
                    UpdatedObject = dbEntity?.UpdatedObject,
                    UpdateType = dbEntity?.UpdateType,
                    RowIdOrRowTypeId = dbEntity?.RowIdOrRowTypeId,
                    Content = dbEntity?.Content,
                },
            };
            return displayData;
        }
    }
    /// <summary>
    /// Logの画面表示用データのうちLog自身の属性
    /// </summary>
    public class LogDisplayDataOwnMembers {
        public string? ID { get; set; }
        public DateTime? LogTime { get; set; }
        public string? UpdatedObject { get; set; }
        public string? UpdateType { get; set; }
        public string? RowIdOrRowTypeId { get; set; }
        public string? Content { get; set; }
    }
    
    // ----------------------- LogRefInfo -----------------------
    /// <summary>
    /// 他のデータがLogを参照している場合に、その参照元のデータの画面上に表示されるLogのデータ型。
    /// </summary>
    public partial class LogRefInfo {
        /// <summary>
        /// Logのキー。保存するときはこの値が使用される。
        /// 新規作成されてからDBに登録されるまでの間のLogをUUID等の不変の値で参照できるようにするために文字列になっている。
        /// </summary>
        public string? __instanceKey { get; set; }
    
        public string? ID { get; set; }
        public string? Content { get; set; }
    
        public static LogRefInfo FromDbEntity(LogDbEntity dbEntity) {
            var instance = new LogRefInfo {
                __instanceKey = new object?[] {
                    dbEntity.ID,
                }.ToJson(),
                ID = dbEntity.ID,
                Content = dbEntity.Content,
            };
            return instance;
        }
    }
#endregion データ構造クラス
}

namespace Katchly {
    using Katchly;
    using Microsoft.EntityFrameworkCore;

    partial class MyDbContext {
        public virtual DbSet<LogDbEntity> LogDbSet { get; set; }

        private void OnModelCreating_Log(ModelBuilder modelBuilder) {
            modelBuilder.Entity<Katchly.LogDbEntity>(entity => {
            
                entity.HasKey(e => new {
                    e.ID,
                });
            
                entity.Property(e => e.ID)
                    .IsRequired(true);
                entity.Property(e => e.LogTime)
                    .IsRequired(false);
                entity.Property(e => e.UpdatedObject)
                    .IsRequired(false);
                entity.Property(e => e.UpdateType)
                    .IsRequired(false);
                entity.Property(e => e.RowIdOrRowTypeId)
                    .IsRequired(false);
                entity.Property(e => e.Content)
                    .IsRequired(false);
            
                
            });
        }
    }
}
