using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Katchly {

    #region ダンプ
    partial class RowController {
        [HttpGet("dump-excel")]
        public IActionResult DumpExcel() {
            var appSrv = (OverridedApplicationService)_applicationService;
            using var ms = new MemoryStream();
            appSrv.DumpExcelBinary(ms);
            return File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
    }
    #endregion ダンプ


    #region 行の並び順の洗い替え（ちゃんとした仕組みができるまでの暫定措置）
    public class DeleteInsertAllParam {
        public string? RowObjectIdList { get; set; }
    }
    partial class RowOrderController {
        [HttpPost("delete-all-row-order")]
        public IActionResult DeleteAllRowOrder() {
            // 全件DELETE
            _applicationService.DbContext.RowOrderDbSet.ExecuteDelete();
            return Ok();
        }
        [HttpPost("insert-all-row-order")]
        public IActionResult InsertAllRowOrder([FromBody] DeleteInsertAllParam param) {
            // パラメータ解釈
            var rowIds = param.RowObjectIdList?.Replace("\r\n", "\n").Split("\n");
            if (rowIds == null) {
                return BadRequest($"{nameof(DeleteInsertAllParam.RowObjectIdList)} に値が指定されていません。");
            }

            // INSERT文組み立て
            var sql = new StringBuilder();
            var parameters = new List<SqliteParameter>();
            sql.AppendLine($"INSERT INTO {nameof(MyDbContext.RowOrderDbSet)}");
            sql.AppendLine($"  ({nameof(RowOrderDbEntity.Row_ID)}, \"{nameof(RowOrderDbEntity.Order)}\")");
            sql.AppendLine($"VALUES");
            for (int i = 0; i < rowIds.Length; i++) {
                var paramName = $"@{i}";
                var value = rowIds[i];
                if (string.IsNullOrWhiteSpace(value)) continue;

                sql.AppendLine(i < rowIds.Length - 1
                    ? $"  ({paramName}, {i}),"
                    : $"  ({paramName}, {i});");
                parameters.Add(new SqliteParameter(paramName, SqliteType.Text) { Value = value });
            }

            // 行データが0件の場合など
            if (parameters.Count == 0) return Ok();

            // まとめてINSERT
            _applicationService.DbContext.Database.ExecuteSqlRaw(sql.ToString(), parameters);
            return Ok();
        }
    }
    #endregion 行の並び順の洗い替え（ちゃんとした仕組みができるまでの暫定措置）
}
