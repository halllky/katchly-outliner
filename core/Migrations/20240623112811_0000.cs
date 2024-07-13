using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlexTree.Migrations
{
    /// <inheritdoc />
    public partial class _0000 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LogDbSet",
                columns: table => new
                {
                    ID = table.Column<string>(type: "TEXT", nullable: false),
                    LogTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedObject = table.Column<string>(type: "TEXT", nullable: true),
                    UpdateType = table.Column<string>(type: "TEXT", nullable: true),
                    RowIdOrRowTypeId = table.Column<string>(type: "TEXT", nullable: true),
                    Content = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogDbSet", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "NIJOBackgroundTaskEntityDbSet",
                columns: table => new
                {
                    JobId = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    BatchType = table.Column<string>(type: "TEXT", nullable: false),
                    ParameterJson = table.Column<string>(type: "TEXT", nullable: false),
                    State = table.Column<int>(type: "INTEGER", nullable: false),
                    RequestTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    StartTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    FinishTime = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NIJOBackgroundTaskEntityDbSet", x => x.JobId);
                });

            migrationBuilder.CreateTable(
                name: "RowTypeDbSet",
                columns: table => new
                {
                    ID = table.Column<string>(type: "TEXT", nullable: false),
                    RowTypeName = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreateUser = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdateUser = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RowTypeDbSet", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ColumnsDbSet",
                columns: table => new
                {
                    Columns_ID = table.Column<string>(type: "TEXT", nullable: false),
                    ColumnId = table.Column<string>(type: "TEXT", nullable: false),
                    ColumnName = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ColumnsDbSet", x => new { x.Columns_ID, x.ColumnId });
                    table.ForeignKey(
                        name: "FK_ColumnsDbSet_RowTypeDbSet_Columns_ID",
                        column: x => x.Columns_ID,
                        principalTable: "RowTypeDbSet",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RowDbSet",
                columns: table => new
                {
                    ID = table.Column<string>(type: "TEXT", nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: true),
                    Indent = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreateUser = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdateUser = table.Column<string>(type: "TEXT", nullable: true),
                    RowType_ID = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RowDbSet", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RowDbSet_RowTypeDbSet_RowType_ID",
                        column: x => x.RowType_ID,
                        principalTable: "RowTypeDbSet",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "AttrsDbSet",
                columns: table => new
                {
                    Attrs_ID = table.Column<string>(type: "TEXT", nullable: false),
                    ColType_Columns_ID = table.Column<string>(type: "TEXT", nullable: false),
                    ColType_ColumnId = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttrsDbSet", x => new { x.Attrs_ID, x.ColType_Columns_ID, x.ColType_ColumnId });
                    table.ForeignKey(
                        name: "FK_AttrsDbSet_ColumnsDbSet_ColType_Columns_ID_ColType_ColumnId",
                        columns: x => new { x.ColType_Columns_ID, x.ColType_ColumnId },
                        principalTable: "ColumnsDbSet",
                        principalColumns: new[] { "Columns_ID", "ColumnId" });
                    table.ForeignKey(
                        name: "FK_AttrsDbSet_RowDbSet_Attrs_ID",
                        column: x => x.Attrs_ID,
                        principalTable: "RowDbSet",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RowOrderDbSet",
                columns: table => new
                {
                    Row_ID = table.Column<string>(type: "TEXT", nullable: false),
                    Order = table.Column<decimal>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RowOrderDbSet", x => x.Row_ID);
                    table.ForeignKey(
                        name: "FK_RowOrderDbSet_RowDbSet_Row_ID",
                        column: x => x.Row_ID,
                        principalTable: "RowDbSet",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "CommentDbSet",
                columns: table => new
                {
                    ID = table.Column<string>(type: "TEXT", nullable: false),
                    TargetRow_ID = table.Column<string>(type: "TEXT", nullable: true),
                    TargetCell_Attrs_ID = table.Column<string>(type: "TEXT", nullable: true),
                    TargetCell_ColType_Columns_ID = table.Column<string>(type: "TEXT", nullable: true),
                    TargetRowType_ID = table.Column<string>(type: "TEXT", nullable: true),
                    TargetColumn_Columns_ID = table.Column<string>(type: "TEXT", nullable: true),
                    TargetCell_ColType_ColumnId = table.Column<string>(type: "TEXT", nullable: true),
                    TargetColumn_ColumnId = table.Column<string>(type: "TEXT", nullable: true),
                    Text = table.Column<string>(type: "TEXT", nullable: true),
                    Author = table.Column<string>(type: "TEXT", nullable: true),
                    Indent = table.Column<int>(type: "INTEGER", nullable: true),
                    Order = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommentDbSet", x => x.ID);
                    table.ForeignKey(
                        name: "FK_CommentDbSet_AttrsDbSet_TargetCell_Attrs_ID_TargetCell_ColType_Columns_ID_TargetCell_ColType_ColumnId",
                        columns: x => new { x.TargetCell_Attrs_ID, x.TargetCell_ColType_Columns_ID, x.TargetCell_ColType_ColumnId },
                        principalTable: "AttrsDbSet",
                        principalColumns: new[] { "Attrs_ID", "ColType_Columns_ID", "ColType_ColumnId" });
                    table.ForeignKey(
                        name: "FK_CommentDbSet_ColumnsDbSet_TargetColumn_Columns_ID_TargetColumn_ColumnId",
                        columns: x => new { x.TargetColumn_Columns_ID, x.TargetColumn_ColumnId },
                        principalTable: "ColumnsDbSet",
                        principalColumns: new[] { "Columns_ID", "ColumnId" });
                    table.ForeignKey(
                        name: "FK_CommentDbSet_RowDbSet_TargetRow_ID",
                        column: x => x.TargetRow_ID,
                        principalTable: "RowDbSet",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_CommentDbSet_RowTypeDbSet_TargetRowType_ID",
                        column: x => x.TargetRowType_ID,
                        principalTable: "RowTypeDbSet",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttrsDbSet_ColType_Columns_ID_ColType_ColumnId",
                table: "AttrsDbSet",
                columns: new[] { "ColType_Columns_ID", "ColType_ColumnId" });

            migrationBuilder.CreateIndex(
                name: "IX_CommentDbSet_TargetCell_Attrs_ID_TargetCell_ColType_Columns_ID_TargetCell_ColType_ColumnId",
                table: "CommentDbSet",
                columns: new[] { "TargetCell_Attrs_ID", "TargetCell_ColType_Columns_ID", "TargetCell_ColType_ColumnId" });

            migrationBuilder.CreateIndex(
                name: "IX_CommentDbSet_TargetColumn_Columns_ID_TargetColumn_ColumnId",
                table: "CommentDbSet",
                columns: new[] { "TargetColumn_Columns_ID", "TargetColumn_ColumnId" });

            migrationBuilder.CreateIndex(
                name: "IX_CommentDbSet_TargetRow_ID",
                table: "CommentDbSet",
                column: "TargetRow_ID");

            migrationBuilder.CreateIndex(
                name: "IX_CommentDbSet_TargetRowType_ID",
                table: "CommentDbSet",
                column: "TargetRowType_ID");

            migrationBuilder.CreateIndex(
                name: "IX_RowDbSet_RowType_ID",
                table: "RowDbSet",
                column: "RowType_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CommentDbSet");

            migrationBuilder.DropTable(
                name: "LogDbSet");

            migrationBuilder.DropTable(
                name: "NIJOBackgroundTaskEntityDbSet");

            migrationBuilder.DropTable(
                name: "RowOrderDbSet");

            migrationBuilder.DropTable(
                name: "AttrsDbSet");

            migrationBuilder.DropTable(
                name: "ColumnsDbSet");

            migrationBuilder.DropTable(
                name: "RowDbSet");

            migrationBuilder.DropTable(
                name: "RowTypeDbSet");
        }
    }
}
