using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlexTree.Migrations
{
    /// <inheritdoc />
    public partial class _0002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LogDbSet");

            migrationBuilder.CreateTable(
                name: "ChangeLogDbSet",
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
                    table.PrimaryKey("PK_ChangeLogDbSet", x => x.ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChangeLogDbSet");

            migrationBuilder.CreateTable(
                name: "LogDbSet",
                columns: table => new
                {
                    ID = table.Column<string>(type: "TEXT", nullable: false),
                    Content = table.Column<string>(type: "TEXT", nullable: true),
                    LogTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RowIdOrRowTypeId = table.Column<string>(type: "TEXT", nullable: true),
                    UpdateType = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedObject = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogDbSet", x => x.ID);
                });
        }
    }
}
