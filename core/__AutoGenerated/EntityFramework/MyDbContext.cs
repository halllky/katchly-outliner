using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Katchly {

    public partial class MyDbContext : DbContext {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        /// <inheritdoc />
        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            this.OnModelCreating_Row(modelBuilder);
            this.OnModelCreating_RowOrder(modelBuilder);
            this.OnModelCreating_RowType(modelBuilder);
            this.OnModelCreating_Comment(modelBuilder);
            this.OnModelCreating_Log(modelBuilder);
            BackgroundTaskEntity.OnModelCreating(modelBuilder);
        }

        /// <inheritdoc />
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.LogTo(sql => {
                if (OutSqlToVisualStudio) {
                    System.Diagnostics.Debug.WriteLine("---------------------");
                    System.Diagnostics.Debug.WriteLine(sql);
                }
            }, LogLevel.Information);
        }
        /// <summary>デバッグ用</summary>
        public bool OutSqlToVisualStudio { get; set; } = false;
    }

}
