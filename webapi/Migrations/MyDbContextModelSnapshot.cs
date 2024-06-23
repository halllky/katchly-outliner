﻿// <auto-generated />
using System;
using Katchly;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FlexTree.Migrations
{
    [DbContext(typeof(MyDbContext))]
    partial class MyDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Proxies:ChangeTracking", false)
                .HasAnnotation("Proxies:CheckEquality", false)
                .HasAnnotation("Proxies:LazyLoading", true);

            modelBuilder.Entity("Katchly.AttrsDbEntity", b =>
                {
                    b.Property<string>("Attrs_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("ColType_Columns_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("ColType_ColumnId")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("UpdatedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Value")
                        .HasColumnType("TEXT");

                    b.HasKey("Attrs_ID", "ColType_Columns_ID", "ColType_ColumnId");

                    b.HasIndex("ColType_Columns_ID", "ColType_ColumnId");

                    b.ToTable("AttrsDbSet");
                });

            modelBuilder.Entity("Katchly.BackgroundTaskEntity", b =>
                {
                    b.Property<string>("JobId")
                        .HasColumnType("TEXT")
                        .HasAnnotation("Relational:JsonPropertyName", "id");

                    b.Property<string>("BatchType")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasAnnotation("Relational:JsonPropertyName", "batchType");

                    b.Property<DateTime?>("FinishTime")
                        .HasColumnType("TEXT")
                        .HasAnnotation("Relational:JsonPropertyName", "finishTime");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasAnnotation("Relational:JsonPropertyName", "name");

                    b.Property<string>("ParameterJson")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasAnnotation("Relational:JsonPropertyName", "parameter");

                    b.Property<DateTime>("RequestTime")
                        .HasColumnType("TEXT")
                        .HasAnnotation("Relational:JsonPropertyName", "requestTime");

                    b.Property<DateTime?>("StartTime")
                        .HasColumnType("TEXT")
                        .HasAnnotation("Relational:JsonPropertyName", "startTime");

                    b.Property<int>("State")
                        .HasColumnType("INTEGER")
                        .HasAnnotation("Relational:JsonPropertyName", "state");

                    b.HasKey("JobId");

                    b.ToTable("NIJOBackgroundTaskEntityDbSet");
                });

            modelBuilder.Entity("Katchly.ColumnsDbEntity", b =>
                {
                    b.Property<string>("Columns_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("ColumnId")
                        .HasColumnType("TEXT");

                    b.Property<string>("ColumnName")
                        .HasColumnType("TEXT");

                    b.HasKey("Columns_ID", "ColumnId");

                    b.ToTable("ColumnsDbSet");
                });

            modelBuilder.Entity("Katchly.CommentDbEntity", b =>
                {
                    b.Property<string>("ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("Author")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<int?>("Indent")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Order")
                        .HasColumnType("INTEGER");

                    b.Property<string>("TargetCell_Attrs_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("TargetCell_ColType_ColumnId")
                        .HasColumnType("TEXT");

                    b.Property<string>("TargetCell_ColType_Columns_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("TargetColumn_ColumnId")
                        .HasColumnType("TEXT");

                    b.Property<string>("TargetColumn_Columns_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("TargetRowType_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("TargetRow_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("Text")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("UpdatedOn")
                        .HasColumnType("TEXT");

                    b.HasKey("ID");

                    b.HasIndex("TargetRowType_ID");

                    b.HasIndex("TargetRow_ID");

                    b.HasIndex("TargetColumn_Columns_ID", "TargetColumn_ColumnId");

                    b.HasIndex("TargetCell_Attrs_ID", "TargetCell_ColType_Columns_ID", "TargetCell_ColType_ColumnId");

                    b.ToTable("CommentDbSet");
                });

            modelBuilder.Entity("Katchly.LogDbEntity", b =>
                {
                    b.Property<string>("ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("LogTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("RowIdOrRowTypeId")
                        .HasColumnType("TEXT");

                    b.Property<string>("UpdateType")
                        .HasColumnType("TEXT");

                    b.Property<string>("UpdatedObject")
                        .HasColumnType("TEXT");

                    b.HasKey("ID");

                    b.ToTable("LogDbSet");
                });

            modelBuilder.Entity("Katchly.RowAttrsRefsDbEntity", b =>
                {
                    b.Property<string>("RowAttrsRefs_Attrs_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("RowAttrsRefs_ColType_Columns_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("RowAttrsRefs_ColType_ColumnId")
                        .HasColumnType("TEXT");

                    b.Property<string>("RefToRow")
                        .HasColumnType("TEXT");

                    b.HasKey("RowAttrsRefs_Attrs_ID", "RowAttrsRefs_ColType_Columns_ID", "RowAttrsRefs_ColType_ColumnId");

                    b.ToTable("RowAttrsRefsDbSet");
                });

            modelBuilder.Entity("Katchly.RowDbEntity", b =>
                {
                    b.Property<string>("ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreateUser")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<int?>("Indent")
                        .HasColumnType("INTEGER");

                    b.Property<string>("RowType_ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("Text")
                        .HasColumnType("TEXT");

                    b.Property<string>("UpdateUser")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("UpdatedOn")
                        .HasColumnType("TEXT");

                    b.HasKey("ID");

                    b.HasIndex("RowType_ID");

                    b.ToTable("RowDbSet");
                });

            modelBuilder.Entity("Katchly.RowOrderDbEntity", b =>
                {
                    b.Property<string>("Row_ID")
                        .HasColumnType("TEXT");

                    b.Property<decimal?>("Order")
                        .HasColumnType("TEXT");

                    b.HasKey("Row_ID");

                    b.ToTable("RowOrderDbSet");
                });

            modelBuilder.Entity("Katchly.RowTypeDbEntity", b =>
                {
                    b.Property<string>("ID")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreateUser")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("RowTypeName")
                        .HasColumnType("TEXT");

                    b.Property<string>("UpdateUser")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("UpdatedOn")
                        .HasColumnType("TEXT");

                    b.HasKey("ID");

                    b.ToTable("RowTypeDbSet");
                });

            modelBuilder.Entity("Katchly.AttrsDbEntity", b =>
                {
                    b.HasOne("Katchly.RowDbEntity", "Parent")
                        .WithMany("Attrs")
                        .HasForeignKey("Attrs_ID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Katchly.ColumnsDbEntity", "ColType")
                        .WithMany("RefferedBy_AttrsDbEntity_ColType")
                        .HasForeignKey("ColType_Columns_ID", "ColType_ColumnId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("ColType");

                    b.Navigation("Parent");
                });

            modelBuilder.Entity("Katchly.ColumnsDbEntity", b =>
                {
                    b.HasOne("Katchly.RowTypeDbEntity", "Parent")
                        .WithMany("Columns")
                        .HasForeignKey("Columns_ID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Parent");
                });

            modelBuilder.Entity("Katchly.CommentDbEntity", b =>
                {
                    b.HasOne("Katchly.RowTypeDbEntity", "TargetRowType")
                        .WithMany("RefferedBy_CommentDbEntity_TargetRowType")
                        .HasForeignKey("TargetRowType_ID")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("Katchly.RowDbEntity", "TargetRow")
                        .WithMany("RefferedBy_CommentDbEntity_TargetRow")
                        .HasForeignKey("TargetRow_ID")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("Katchly.ColumnsDbEntity", "TargetColumn")
                        .WithMany("RefferedBy_CommentDbEntity_TargetColumn")
                        .HasForeignKey("TargetColumn_Columns_ID", "TargetColumn_ColumnId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("Katchly.AttrsDbEntity", "TargetCell")
                        .WithMany("RefferedBy_CommentDbEntity_TargetCell")
                        .HasForeignKey("TargetCell_Attrs_ID", "TargetCell_ColType_Columns_ID", "TargetCell_ColType_ColumnId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.Navigation("TargetCell");

                    b.Navigation("TargetColumn");

                    b.Navigation("TargetRow");

                    b.Navigation("TargetRowType");
                });

            modelBuilder.Entity("Katchly.RowAttrsRefsDbEntity", b =>
                {
                    b.HasOne("Katchly.AttrsDbEntity", "Parent")
                        .WithMany("RowAttrsRefs")
                        .HasForeignKey("RowAttrsRefs_Attrs_ID", "RowAttrsRefs_ColType_Columns_ID", "RowAttrsRefs_ColType_ColumnId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Parent");
                });

            modelBuilder.Entity("Katchly.RowDbEntity", b =>
                {
                    b.HasOne("Katchly.RowTypeDbEntity", "RowType")
                        .WithMany("RefferedBy_RowDbEntity_RowType")
                        .HasForeignKey("RowType_ID")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.Navigation("RowType");
                });

            modelBuilder.Entity("Katchly.RowOrderDbEntity", b =>
                {
                    b.HasOne("Katchly.RowDbEntity", "Row")
                        .WithOne("RefferedBy_RowOrderDbEntity_Row")
                        .HasForeignKey("Katchly.RowOrderDbEntity", "Row_ID")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Row");
                });

            modelBuilder.Entity("Katchly.AttrsDbEntity", b =>
                {
                    b.Navigation("RefferedBy_CommentDbEntity_TargetCell");

                    b.Navigation("RowAttrsRefs");
                });

            modelBuilder.Entity("Katchly.ColumnsDbEntity", b =>
                {
                    b.Navigation("RefferedBy_AttrsDbEntity_ColType");

                    b.Navigation("RefferedBy_CommentDbEntity_TargetColumn");
                });

            modelBuilder.Entity("Katchly.RowDbEntity", b =>
                {
                    b.Navigation("Attrs");

                    b.Navigation("RefferedBy_CommentDbEntity_TargetRow");

                    b.Navigation("RefferedBy_RowOrderDbEntity_Row");
                });

            modelBuilder.Entity("Katchly.RowTypeDbEntity", b =>
                {
                    b.Navigation("Columns");

                    b.Navigation("RefferedBy_CommentDbEntity_TargetRowType");

                    b.Navigation("RefferedBy_RowDbEntity_RowType");
                });
#pragma warning restore 612, 618
        }
    }
}
