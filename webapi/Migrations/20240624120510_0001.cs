using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlexTree.Migrations
{
    /// <inheritdoc />
    public partial class _0001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CanReferOnly",
                table: "ColumnsDbSet",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ValueType",
                table: "ColumnsDbSet",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RowAttrsRefsDbSet",
                columns: table => new
                {
                    RowAttrsRefs_Attrs_ID = table.Column<string>(type: "TEXT", nullable: false),
                    RowAttrsRefs_ColType_Columns_ID = table.Column<string>(type: "TEXT", nullable: false),
                    RowAttrsRefs_ColType_ColumnId = table.Column<string>(type: "TEXT", nullable: false),
                    RefToRow = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RowAttrsRefsDbSet", x => new { x.RowAttrsRefs_Attrs_ID, x.RowAttrsRefs_ColType_Columns_ID, x.RowAttrsRefs_ColType_ColumnId });
                    table.ForeignKey(
                        name: "FK_RowAttrsRefsDbSet_AttrsDbSet_RowAttrsRefs_Attrs_ID_RowAttrsRefs_ColType_Columns_ID_RowAttrsRefs_ColType_ColumnId",
                        columns: x => new { x.RowAttrsRefs_Attrs_ID, x.RowAttrsRefs_ColType_Columns_ID, x.RowAttrsRefs_ColType_ColumnId },
                        principalTable: "AttrsDbSet",
                        principalColumns: new[] { "Attrs_ID", "ColType_Columns_ID", "ColType_ColumnId" },
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RowAttrsRefsDbSet");

            migrationBuilder.DropColumn(
                name: "CanReferOnly",
                table: "ColumnsDbSet");

            migrationBuilder.DropColumn(
                name: "ValueType",
                table: "ColumnsDbSet");
        }
    }
}
