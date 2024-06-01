namespace Katchly {
    using Katchly;

    public partial class AutoGeneratedApplicationService {
        public AutoGeneratedApplicationService(IServiceProvider serviceProvider) {
            ServiceProvider = serviceProvider;
        }

        public IServiceProvider ServiceProvider { get; }

        private MyDbContext? _dbContext;
        public virtual MyDbContext DbContext => _dbContext ??= ServiceProvider.GetRequiredService<MyDbContext>();

        private DateTime? _currentTime;
        public virtual DateTime CurrentTime => _currentTime ??= DateTime.Now;

        #region 非同期処理
        public bool TryScheduleJob(string batchType, object? parameter, out ICollection<string> errors) {
            BackgroundTask job;
            try {
                job = BackgroundTask.FindTaskByID(batchType);
            } catch (Exception ex) {
                errors = new[] { ex.Message };
                return false;
            }
            return TryScheduleJob(job, parameter, out errors);
        }
        public bool TryScheduleJob<TJob>(out ICollection<string> errors)
            where TJob : BackgroundTask, new() {
            var job = new TJob();
            return TryScheduleJob(job, null, out errors);
        }
        public bool TryScheduleJob<TJob, TParameter>(TParameter parameter, out ICollection<string> errors)
            where TJob : BackgroundTask<TParameter>, new()
            where TParameter : new() {
            var job = new TJob();
            return TryScheduleJob(job, parameter, out errors);
        }
        private bool TryScheduleJob(BackgroundTask job, object? parameter, out ICollection<string> errors) {
            errors = job.ValidateParameter(parameter).ToArray();
            if (errors.Any()) return false;
        
            var json = parameter == null
                ? string.Empty
                : Util.ToJson(parameter);
        
            var entity = new Katchly.BackgroundTaskEntity {
                JobId = Guid.NewGuid().ToString(),
                Name = job.GetJobName(parameter),
                BatchType = job.BatchTypeId,
                ParameterJson = json,
                RequestTime = CurrentTime,
                State = E_BackgroundTaskState.WaitToStart,
            };
            DbContext.Add(entity);
            DbContext.SaveChanges();
        
            return true;
        }
        #endregion 非同期処理
    }
}
