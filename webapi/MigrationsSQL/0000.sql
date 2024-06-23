CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;

CREATE TABLE "LogDbSet" (
    "ID" TEXT NOT NULL CONSTRAINT "PK_LogDbSet" PRIMARY KEY,
    "LogTime" TEXT NULL,
    "UpdatedObject" TEXT NULL,
    "UpdateType" TEXT NULL,
    "RowIdOrRowTypeId" TEXT NULL,
    "Content" TEXT NULL
);

CREATE TABLE "NIJOBackgroundTaskEntityDbSet" (
    "JobId" TEXT NOT NULL CONSTRAINT "PK_NIJOBackgroundTaskEntityDbSet" PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "BatchType" TEXT NOT NULL,
    "ParameterJson" TEXT NOT NULL,
    "State" INTEGER NOT NULL,
    "RequestTime" TEXT NOT NULL,
    "StartTime" TEXT NULL,
    "FinishTime" TEXT NULL
);

CREATE TABLE "RowTypeDbSet" (
    "ID" TEXT NOT NULL CONSTRAINT "PK_RowTypeDbSet" PRIMARY KEY,
    "RowTypeName" TEXT NULL,
    "CreatedOn" TEXT NULL,
    "CreateUser" TEXT NULL,
    "UpdatedOn" TEXT NULL,
    "UpdateUser" TEXT NULL
);

CREATE TABLE "ColumnsDbSet" (
    "Columns_ID" TEXT NOT NULL,
    "ColumnId" TEXT NOT NULL,
    "ColumnName" TEXT NULL,
    CONSTRAINT "PK_ColumnsDbSet" PRIMARY KEY ("Columns_ID", "ColumnId"),
    CONSTRAINT "FK_ColumnsDbSet_RowTypeDbSet_Columns_ID" FOREIGN KEY ("Columns_ID") REFERENCES "RowTypeDbSet" ("ID") ON DELETE CASCADE
);

CREATE TABLE "RowDbSet" (
    "ID" TEXT NOT NULL CONSTRAINT "PK_RowDbSet" PRIMARY KEY,
    "Text" TEXT NULL,
    "Indent" INTEGER NULL,
    "CreatedOn" TEXT NULL,
    "CreateUser" TEXT NULL,
    "UpdatedOn" TEXT NULL,
    "UpdateUser" TEXT NULL,
    "RowType_ID" TEXT NULL,
    CONSTRAINT "FK_RowDbSet_RowTypeDbSet_RowType_ID" FOREIGN KEY ("RowType_ID") REFERENCES "RowTypeDbSet" ("ID")
);

CREATE TABLE "AttrsDbSet" (
    "Attrs_ID" TEXT NOT NULL,
    "ColType_Columns_ID" TEXT NOT NULL,
    "ColType_ColumnId" TEXT NOT NULL,
    "Value" TEXT NULL,
    "UpdatedOn" TEXT NULL,
    CONSTRAINT "PK_AttrsDbSet" PRIMARY KEY ("Attrs_ID", "ColType_Columns_ID", "ColType_ColumnId"),
    CONSTRAINT "FK_AttrsDbSet_ColumnsDbSet_ColType_Columns_ID_ColType_ColumnId" FOREIGN KEY ("ColType_Columns_ID", "ColType_ColumnId") REFERENCES "ColumnsDbSet" ("Columns_ID", "ColumnId"),
    CONSTRAINT "FK_AttrsDbSet_RowDbSet_Attrs_ID" FOREIGN KEY ("Attrs_ID") REFERENCES "RowDbSet" ("ID") ON DELETE CASCADE
);

CREATE TABLE "RowOrderDbSet" (
    "Row_ID" TEXT NOT NULL CONSTRAINT "PK_RowOrderDbSet" PRIMARY KEY,
    "Order" TEXT NULL,
    CONSTRAINT "FK_RowOrderDbSet_RowDbSet_Row_ID" FOREIGN KEY ("Row_ID") REFERENCES "RowDbSet" ("ID")
);

CREATE TABLE "CommentDbSet" (
    "ID" TEXT NOT NULL CONSTRAINT "PK_CommentDbSet" PRIMARY KEY,
    "TargetRow_ID" TEXT NULL,
    "TargetCell_Attrs_ID" TEXT NULL,
    "TargetCell_ColType_Columns_ID" TEXT NULL,
    "TargetRowType_ID" TEXT NULL,
    "TargetColumn_Columns_ID" TEXT NULL,
    "TargetCell_ColType_ColumnId" TEXT NULL,
    "TargetColumn_ColumnId" TEXT NULL,
    "Text" TEXT NULL,
    "Author" TEXT NULL,
    "Indent" INTEGER NULL,
    "Order" INTEGER NULL,
    "CreatedOn" TEXT NULL,
    "UpdatedOn" TEXT NULL,
    CONSTRAINT "FK_CommentDbSet_AttrsDbSet_TargetCell_Attrs_ID_TargetCell_ColType_Columns_ID_TargetCell_ColType_ColumnId" FOREIGN KEY ("TargetCell_Attrs_ID", "TargetCell_ColType_Columns_ID", "TargetCell_ColType_ColumnId") REFERENCES "AttrsDbSet" ("Attrs_ID", "ColType_Columns_ID", "ColType_ColumnId"),
    CONSTRAINT "FK_CommentDbSet_ColumnsDbSet_TargetColumn_Columns_ID_TargetColumn_ColumnId" FOREIGN KEY ("TargetColumn_Columns_ID", "TargetColumn_ColumnId") REFERENCES "ColumnsDbSet" ("Columns_ID", "ColumnId"),
    CONSTRAINT "FK_CommentDbSet_RowDbSet_TargetRow_ID" FOREIGN KEY ("TargetRow_ID") REFERENCES "RowDbSet" ("ID"),
    CONSTRAINT "FK_CommentDbSet_RowTypeDbSet_TargetRowType_ID" FOREIGN KEY ("TargetRowType_ID") REFERENCES "RowTypeDbSet" ("ID")
);

CREATE INDEX "IX_AttrsDbSet_ColType_Columns_ID_ColType_ColumnId" ON "AttrsDbSet" ("ColType_Columns_ID", "ColType_ColumnId");

CREATE INDEX "IX_CommentDbSet_TargetCell_Attrs_ID_TargetCell_ColType_Columns_ID_TargetCell_ColType_ColumnId" ON "CommentDbSet" ("TargetCell_Attrs_ID", "TargetCell_ColType_Columns_ID", "TargetCell_ColType_ColumnId");

CREATE INDEX "IX_CommentDbSet_TargetColumn_Columns_ID_TargetColumn_ColumnId" ON "CommentDbSet" ("TargetColumn_Columns_ID", "TargetColumn_ColumnId");

CREATE INDEX "IX_CommentDbSet_TargetRow_ID" ON "CommentDbSet" ("TargetRow_ID");

CREATE INDEX "IX_CommentDbSet_TargetRowType_ID" ON "CommentDbSet" ("TargetRowType_ID");

CREATE INDEX "IX_RowDbSet_RowType_ID" ON "RowDbSet" ("RowType_ID");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240623112811_0000', '8.0.1');

COMMIT;


