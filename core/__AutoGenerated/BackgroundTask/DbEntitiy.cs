namespace Katchly {
    using Microsoft.EntityFrameworkCore;
    using System.Text.Json.Serialization;

    public class BackgroundTaskEntity {
        [JsonPropertyName("id")]
        public string JobId { get; set; } = string.Empty;
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("batchType")]
        public string BatchType { get; set; } = string.Empty;
        [JsonPropertyName("parameter")]
        public string ParameterJson { get; set; } = string.Empty;
        [JsonPropertyName("state")]
        public E_BackgroundTaskState State { get; set; }
        [JsonPropertyName("requestTime")]
        public DateTime RequestTime { get; set; }
        [JsonPropertyName("startTime")]
        public DateTime? StartTime { get; set; }
        [JsonPropertyName("finishTime")]
        public DateTime? FinishTime { get; set; }

        public static void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<BackgroundTaskEntity>(e => {
                e.HasKey(e => e.JobId);
            });
        }
    }

    partial class MyDbContext {
        public virtual DbSet<Katchly.BackgroundTaskEntity> NIJOBackgroundTaskEntityDbSet { get; set; }
    }
}
