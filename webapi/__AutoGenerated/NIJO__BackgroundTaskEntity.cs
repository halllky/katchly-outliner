namespace Katchly {
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Infrastructure;
    using Katchly;

    [ApiController]
    [Route("api/[controller]")]
    public partial class NIJOBackgroundTaskEntityController : ControllerBase {
        public NIJOBackgroundTaskEntityController(ILogger<NIJOBackgroundTaskEntityController> logger, AutoGeneratedApplicationService applicationService) {
            _logger = logger;
            _applicationService = applicationService;
        }
        protected readonly ILogger<NIJOBackgroundTaskEntityController> _logger;
        protected readonly AutoGeneratedApplicationService _applicationService;

        [HttpPost("schedule/{jobType}")]
        public virtual IActionResult Schedule(string? jobType, [FromBody] object? param) {
            if (string.IsNullOrWhiteSpace(jobType)) {
                return BadRequest("ジョブ種別を指定してください。");
        
            } else if (!_applicationService.TryScheduleJob(jobType, param, out var errors)) {
                return BadRequest(string.Join(Environment.NewLine, errors));
        
            } else {
                return Ok();
            }
        }
        [HttpGet("ls")]
        public virtual IActionResult Listup(
            [FromQuery] DateTime? since,
            [FromQuery] DateTime? until,
            [FromQuery] int? skip,
            [FromQuery] int? take) {
        
            var query = (IQueryable<BackgroundTaskEntity>)_applicationService.DbContext.NIJOBackgroundTaskEntityDbSet.AsNoTracking();
        
            // 絞り込み
            if (since != null) {
                var paramSince = since.Value.Date;
                query = query.Where(e => e.RequestTime >= paramSince);
            }
            if (until != null) {
                var paramUntil = until.Value.Date.AddDays(1);
                query = query.Where(e => e.RequestTime <= paramUntil);
            }
        
            // 順番
            query = query.OrderByDescending(e => e.RequestTime);
        
            // ページング
            if (skip != null) query = query.Skip(skip.Value);
        
            const int DEFAULT_PAGE_SIZE = 20;
            var pageSize = take ?? DEFAULT_PAGE_SIZE;
            query = query.Take(pageSize);
        
            return this.JsonContent(query.ToArray());
        }
    }


    partial class AutoGeneratedApplicationService {
        
    }


#region データ構造クラス
    
#endregion データ構造クラス
}

namespace Katchly {
    using Katchly;
    using Microsoft.EntityFrameworkCore;

    partial class MyDbContext {

        private void OnModelCreating_NIJOBackgroundTaskEntity(ModelBuilder modelBuilder) {
            BackgroundTaskEntity.OnModelCreating(modelBuilder);
        }
    }
}
