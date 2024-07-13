BEGIN TRANSACTION;

ALTER TABLE "LogDbSet" RENAME TO "LogDbSet_old";

CREATE TABLE "ChangeLogDbSet" (
    "ID" TEXT NOT NULL CONSTRAINT "PK_ChangeLogDbSet" PRIMARY KEY,
    "LogTime" TEXT NULL,
    "UpdatedObject" TEXT NULL,
    "UpdateType" TEXT NULL,
    "RowIdOrRowTypeId" TEXT NULL,
    "Content" TEXT NULL
);

INSERT INTO "ChangeLogDbSet" ("ID", "LogTime", "UpdatedObject", "UpdateType", "RowIdOrRowTypeId", "Content")
SELECT "ID", "LogTime", "UpdatedObject", "UpdateType", "RowIdOrRowTypeId", "Content" FROM "LogDbSet_old";

DROP TABLE "LogDbSet_old";

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20240713011947_0002', '8.0.1');

COMMIT;


