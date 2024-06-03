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
    public partial class RowOrderController : ControllerBase {
        public RowOrderController(ILogger<RowOrderController> logger, AutoGeneratedApplicationService applicationService) {
            _logger = logger;
            _applicationService = applicationService;
        }
        protected readonly ILogger<RowOrderController> _logger;
        protected readonly AutoGeneratedApplicationService _applicationService;

        [HttpPost("create")]
        public virtual IActionResult Create([FromBody] RowOrderCreateCommand param) {
            if (_applicationService.CreateRowOrder(param, out var created, out var errors)) {
                return this.JsonContent(created);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpGet("detail/{Row_ID}")]
        public virtual IActionResult Find(string? Row_ID) {
            if (Row_ID == null) return BadRequest();
            var instance = _applicationService.FindRowOrder(Row_ID);
            if (instance == null) {
                return NotFound();
            } else {
                return this.JsonContent(instance);
            }
        }
        [HttpPost("update")]
        public virtual IActionResult Update(RowOrderSaveCommand param) {
            if (_applicationService.UpdateRowOrder(param, out var updated, out var errors)) {
                return this.JsonContent(updated);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpDelete("delete")]
        public virtual IActionResult Delete(RowOrderSaveCommand param) {
            if (_applicationService.DeleteRowOrder(param, out var errors)) {
                return Ok();
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        [HttpPost("load")]
        public virtual IActionResult Load([FromBody]RowOrderSearchCondition? filter, [FromQuery] int? skip, [FromQuery] int? take) {
            var instances = _applicationService.LoadRowOrder(filter, skip, take);
            return this.JsonContent(instances.ToArray());
        }
        [HttpGet("list-by-keyword")]
        public virtual IActionResult SearchByKeywordx29a9c912e5efa23f5781a3a7e18e9808([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordRowOrder(keyword);
            return this.JsonContent(items);
        }
    }


    partial class AutoGeneratedApplicationService {
        public virtual bool CreateRowOrder(RowOrderCreateCommand command, out RowOrderDisplayData created, out ICollection<string> errors) {
            var dbEntity = command.ToDbEntity();
            DbContext.Add(dbEntity);
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                created = new RowOrderDisplayData();
                errors = ex.GetMessagesRecursively("  ").ToList();
                return false;
            }
        
            var afterUpdate = this.FindRowOrder(dbEntity.Row_ID);
            if (afterUpdate == null) {
                created = new RowOrderDisplayData();
                errors = new[] { "更新後のデータの再読み込みに失敗しました。" };
                return false;
            }
        
            created = afterUpdate;
            errors = new List<string>();
        
            // // RowOrderの更新をトリガーとする処理を実行します。
            // var updateEvent = new AggregateUpdateEvent<RowOrderSaveCommand> {
            //     Created = new[] { afterUpdate },
            // };
        
            return true;
        }
        /// <summary>
        /// RowOrderのキー情報から対象データの詳細を検索して返します。
        /// </summary>
        public virtual RowOrderDisplayData? FindRowOrder(string? Row_ID) {
        
            var entity = DbContext.RowOrderDbSet
                .AsNoTracking()
                .Include(x => x.Row)
                .SingleOrDefault(x => x.Row_ID == Row_ID);
        
            if (entity == null) return null;
        
            var aggregateInstance = RowOrderDisplayData.FromDbEntity(entity);
            return aggregateInstance;
        }
        public virtual bool UpdateRowOrder(RowOrderSaveCommand after, out RowOrderDisplayData updated, out ICollection<string> errors) {
            errors = new List<string>();
        
            var beforeDbEntity = DbContext.RowOrderDbSet
                .AsNoTracking()
                .Include(x => x.Row)
                .SingleOrDefault(x => x.Row_ID == after.Row.ID);
        
            if (beforeDbEntity == null) {
                updated = new RowOrderDisplayData();
                errors.Add("更新対象のデータが見つかりません。");
                return false;
            }
        
            var beforeUpdate = RowOrderSaveCommand.FromDbEntity(beforeDbEntity);
            var afterDbEntity = after.ToDbEntity();
        
            // Attach
            DbContext.Entry(afterDbEntity).State = EntityState.Modified;
        
            
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                updated = new RowOrderDisplayData();
                foreach (var msg in ex.GetMessagesRecursively()) errors.Add(msg);
                return false;
            }
        
            var afterUpdate = this.FindRowOrder(after.Row.ID);
            if (afterUpdate == null) {
                updated = new RowOrderDisplayData();
                errors.Add("更新後のデータの再読み込みに失敗しました。");
                return false;
            }
        
            // // RowOrderの更新をトリガーとする処理を実行します。
            // var updateEvent = new AggregateUpdateEvent<RowOrderSaveCommand> {
            //     Modified = new AggregateBeforeAfter<RowOrderSaveCommand>[] { new() { Before = beforeUpdate, After = afterUpdate } },
            // };
        
            updated = afterUpdate;
            return true;
        }
        public virtual bool DeleteRowOrder(RowOrderSaveCommand data, out ICollection<string> errors) {
        
            var entity = DbContext.RowOrderDbSet
                .Include(x => x.Row)
                .SingleOrDefault(x => x.Row_ID == data.Row.ID);
        
            if (entity == null) {
                errors = new[] { "削除対象のデータが見つかりません。" };
                return false;
            }
        
            var deleted = RowOrderSaveCommand.FromDbEntity(entity);
        
            DbContext.Remove(entity);
        
            try {
                DbContext.SaveChanges();
            } catch (DbUpdateException ex) {
                errors = ex.GetMessagesRecursively().ToArray();
                return false;
            }
        
            // // RowOrderの更新をトリガーとする処理を実行します。
            // var updateEvent = new AggregateUpdateEvent<RowOrderSaveCommand> {
            //     Deleted = new[] { deleted },
            // };
        
            errors = Array.Empty<string>();
            return true;
        }
        /// <summary>
        /// RowOrderを検索して返します。
        /// </summary>
        public virtual IEnumerable<RowOrderDisplayData> LoadRowOrder(RowOrderSearchCondition? filter, int? skip, int? take) {
        
            var query = (IQueryable<RowOrderDbEntity>)DbContext.RowOrderDbSet
                .AsNoTracking()
                .Include(x => x.Row)
                ;
        
            // 絞り込み
            if (!string.IsNullOrWhiteSpace(filter?.Row?.ID)) {
                query = query.Where(x => x.Row.ID == filter.Row.ID);
            }
            if (!string.IsNullOrWhiteSpace(filter?.Row?.Text)) {
                var trimmed = filter.Row.Text.Trim();
                query = query.Where(x => x.Row.Text.Contains(trimmed));
            }
            if (!string.IsNullOrWhiteSpace(filter?.Row?.RowType?.ID)) {
                query = query.Where(x => x.Row.RowType.ID == filter.Row.RowType.ID);
            }
            if (!string.IsNullOrWhiteSpace(filter?.Row?.RowType?.RowTypeName)) {
                var trimmed = filter.Row.RowType.RowTypeName.Trim();
                query = query.Where(x => x.Row.RowType.RowTypeName.Contains(trimmed));
            }
            if (filter?.Row?.Indent?.From != default) {
                query = query.Where(x => x.Row.Indent >= filter.Row.Indent.From);
            }
            if (filter?.Row?.Indent?.To != default) {
                query = query.Where(x => x.Row.Indent <= filter.Row.Indent.To);
            }
            if (filter?.Order?.From != default) {
                query = query.Where(x => x.Order >= filter.Order.From);
            }
            if (filter?.Order?.To != default) {
                query = query.Where(x => x.Order <= filter.Order.To);
            }
        
            // 順番
            query = query
                .OrderBy(x => x.Row.ID)
                ;
        
            // ページング
            if (skip != null) query = query.Skip(skip.Value);
        
            const int DEFAULT_PAGE_SIZE = 20;
            var pageSize = take ?? DEFAULT_PAGE_SIZE;
            query = query.Take(pageSize);
        
            return query
                .AsEnumerable()
                .Select(entity => RowOrderDisplayData.FromDbEntity(entity));
        }
        /// <summary>
        /// RowOrderをキーワードで検索します。
        /// </summary>
        public virtual IEnumerable<RowOrderRefInfo> SearchByKeywordRowOrder(string? keyword) {
            var query = (IQueryable<RowOrderDbEntity>)DbContext.RowOrderDbSet;
        
            if (!string.IsNullOrWhiteSpace(keyword)) {
                var like = $"%{keyword.Trim().Replace("%", "\\%")}%";
                query = query.Where(item => EF.Functions.Like(item.Row.ID, like));
            }
        
            var results = query
                .OrderBy(m => m.Row.ID)
                .Take(101)
                .AsEnumerable()
                .Select(entity => RowOrderRefInfo.FromDbEntity(entity));
        
            return results;
        }
    }


#region データ構造クラス
    /// <summary>
    /// RowOrderのデータ作成コマンドです。
    /// </summary>
    public partial class RowOrderCreateCommand {
        public RowKeys? Row { get; set; }
        public decimal? Order { get; set; }
    
        /// <summary>
        /// RowOrderのオブジェクトをデータベースに保存する形に変換します。
        /// </summary>
        public Katchly.RowOrderDbEntity ToDbEntity() {
            return new Katchly.RowOrderDbEntity {
                Row_ID = this.Row?.ID,
                Order = this.Order,
            };
        }
    }
    /// <summary>
    /// RowOrderのデータ1件の詳細を表すクラスです。
    /// </summary>
    public partial class RowOrderSaveCommand {
        public RowKeys? Row { get; set; }
        public decimal? Order { get; set; }
    
        /// <summary>
        /// RowOrderのオブジェクトをデータベースに保存する形に変換します。
        /// </summary>
        public Katchly.RowOrderDbEntity ToDbEntity() {
            return new Katchly.RowOrderDbEntity {
                Row_ID = this.Row?.ID,
                Order = this.Order,
            };
        }
        /// <summary>
        /// RowOrderのデータベースから取得した内容を画面に表示する形に変換します。
        /// </summary>
        public static RowOrderSaveCommand FromDbEntity(Katchly.RowOrderDbEntity entity) {
            var instance = new RowOrderSaveCommand {
                Row = new RowKeys() {
                    ID = entity.Row?.ID,
                },
                Order = entity.Order,
            };
            return instance;
        }
    }
    public class RowOrderSearchCondition {
        public RowOrder_RowSearchCondition Row { get; set; } = new();
        public FromTo<decimal?> Order { get; set; } = new();
    }
    public class RowOrder_RowSearchCondition {
        public string? ID { get; set; }
        public string? Text { get; set; }
        public RowOrder_Row_RowTypeSearchCondition RowType { get; set; } = new();
        public FromTo<int?> Indent { get; set; } = new();
    }
    public class RowOrder_Row_RowTypeSearchCondition {
        public string? ID { get; set; }
        public string? RowTypeName { get; set; }
    }
    public class RowOrderKeys {
        [Key]
        public RowKeys? Row { get; set; }
    }
    /// <summary>
    /// RowOrderのデータベースに保存されるデータの形を表すクラスです。
    /// </summary>
    public partial class RowOrderDbEntity {
        public string? Row_ID { get; set; }
        public decimal? Order { get; set; }
    
        public virtual RowDbEntity? Row { get; set; }
    
        /// <summary>このオブジェクトと比較対象のオブジェクトの主キーが一致するかを返します。</summary>
        public bool KeyEquals(RowOrderDbEntity entity) {
            if (entity.Row_ID != this.Row_ID) return false;
            return true;
        }
    }
    /// <summary>
    /// RowOrderの画面表示用データ
    /// </summary>
    public partial class RowOrderDisplayData {
        public string localRepositoryItemKey { get; set; }
        public bool existsInRemoteRepository { get; set; }
        public bool willBeChanged { get; set; }
        public bool willBeDeleted { get; set; }
        public RowOrderDisplayDataOwnMembers own_members { get; set; } = new();
    
        public static RowOrderDisplayData FromDbEntity(RowOrderDbEntity dbEntity) {
            var displayData = new RowOrderDisplayData {
                localRepositoryItemKey = new object?[] { dbEntity.Row?.ID }.ToJson(),
                existsInRemoteRepository = true,
                willBeChanged = false,
                willBeDeleted = false,
                own_members = new() {
                    Row = new RowRefInfo {
                        __instanceKey = new object?[] {
                            dbEntity?.Row?.ID,
                        }.ToJson(),
                        ID = dbEntity?.Row?.ID,
                        Text = dbEntity?.Row?.Text,
                    },
                    Order = dbEntity?.Order,
                },
            };
            return displayData;
        }
    }
    public class RowOrderDisplayDataOwnMembers {
        public RowRefInfo? Row { get; set; }
        public decimal? Order { get; set; }
    }
    
    // ----------------------- RowOrderRefInfo -----------------------
    /// <summary>
    /// RowOrderを参照する他のデータの画面上に表示されるRowOrderのデータ型。
    /// </summary>
    public partial class RowOrderRefInfo {
        /// <summary>
        /// RowOrderのキー。保存するときはこの値が使用される。
        /// 新規作成されてからDBに登録されるまでの間のRowOrderをUUID等の不変の値で参照できるようにするために文字列になっている。
        /// </summary>
        public string? __instanceKey { get; set; }
    
        public RowOrderRefInfo_Row? Row { get; set; }
    
        public static RowOrderRefInfo FromDbEntity(RowOrderDbEntity dbEntity) {
            var instance = new RowOrderRefInfo {
                __instanceKey = new object?[] {
                    dbEntity.Row_ID,
                }.ToJson(),
                Row = new() {
                    ID = dbEntity.Row?.ID,
                    Text = dbEntity.Row?.Text,
                },
            };
            return instance;
        }
    }
    public partial class RowOrderRefInfo_Row {
        public string? ID { get; set; }
        public string? Text { get; set; }
    }
#endregion データ構造クラス
}

namespace Katchly {
    using Katchly;
    using Microsoft.EntityFrameworkCore;

    partial class MyDbContext {
        public virtual DbSet<RowOrderDbEntity> RowOrderDbSet { get; set; }

        private void OnModelCreating_RowOrder(ModelBuilder modelBuilder) {
            modelBuilder.Entity<Katchly.RowOrderDbEntity>(entity => {
            
                entity.HasKey(e => new {
                    e.Row_ID,
                });
            
                entity.Property(e => e.Row_ID)
                    .IsRequired(true);
                entity.Property(e => e.Order)
                    .IsRequired(false);
            
                
            });
        }
    }
}
