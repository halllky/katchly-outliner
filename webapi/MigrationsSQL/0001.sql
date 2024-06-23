BEGIN TRANSACTION;

CREATE TABLE "RowAttrsRefsDbSet" (
    "RowAttrsRefs_Attrs_ID" TEXT NOT NULL,
    "RowAttrsRefs_ColType_Columns_ID" TEXT NOT NULL,
    "RowAttrsRefs_ColType_ColumnId" TEXT NOT NULL,
    "RefToRow" TEXT NULL,
    CONSTRAINT "PK_RowAttrsRefsDbSet" PRIMARY KEY ("RowAttrsRefs_Attrs_ID", "RowAttrsRefs_ColType_Columns_ID", "RowAttrsRefs_ColType_ColumnId"),
    CONSTRAINT "FK_RowAttrsRefsDbSet_AttrsDbSet_RowAttrsRefs_Attrs_ID_RowAttrsRefs_ColType_Columns_ID_RowAttrsRefs_ColType_ColumnId" FOREIGN KEY ("RowAttrsRefs_Attrs_ID", "RowAttrsRefs_ColType_Columns_ID", "RowAttrsRefs_ColType_ColumnId") REFERENCES "AttrsDbSet" ("Attrs_ID", "ColType_Columns_ID", "ColType_ColumnId") ON DELETE CASCADE
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240623120545_0001', '8.0.1');

COMMIT;


