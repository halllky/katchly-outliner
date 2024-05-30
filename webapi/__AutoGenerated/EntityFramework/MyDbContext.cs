using Microsoft.EntityFrameworkCore;

namespace FlexTree {

    public partial class MyDbContext : DbContext {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        /// <inheritdoc />
        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            this.OnModelCreating_NIJOBackgroundTaskEntity(modelBuilder);
            this.OnModelCreating_親集約(modelBuilder);
            this.OnModelCreating_参照先(modelBuilder);
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
