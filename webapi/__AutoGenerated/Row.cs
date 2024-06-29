﻿namespace Katchly {
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

    /// <summary>
    /// Rowに関する Web API 操作を提供する ASP.NET Core のコントローラー
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public partial class RowController : ControllerBase {
        public RowController(ILogger<RowController> logger, AutoGeneratedApplicationService applicationService) {
            _logger = logger;
            _applicationService = applicationService;
        }
        protected readonly ILogger<RowController> _logger;
        protected readonly AutoGeneratedApplicationService _applicationService;

        /// <summary>
        /// 新しいRowを作成する情報を受け取って登録する Web API
        /// </summary>
        [HttpPost("create")]
        public virtual IActionResult Create([FromBody] RowCreateCommand param) {
            if (_applicationService.CreateRow(param, out var created, out var errors)) {
                return this.JsonContent(created);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        /// <summary>
        /// 既存のRowをキーで1件検索する Web API
        /// </summary>
        [HttpGet("detail/{ID}")]
        public virtual IActionResult Find(string? ID) {
            if (ID == null) return BadRequest();
            var instance = _applicationService.FindRow(ID);
            if (instance == null) {
                return NotFound();
            } else {
                return this.JsonContent(instance);
            }
        }
        /// <summary>
        /// 既存のRowを更新する Web API
        /// </summary>
        [HttpPost("update")]
        public virtual IActionResult Update(RowSaveCommand param) {
            if (_applicationService.UpdateRow(param, out var updated, out var errors)) {
                return this.JsonContent(updated);
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        /// <summary>
        /// 既存のRowを削除する Web API
        /// </summary>
        [HttpDelete("delete")]
        public virtual IActionResult Delete(RowSaveCommand param) {
            if (_applicationService.DeleteRow(param, out var errors)) {
                return Ok();
            } else {
                return BadRequest(this.JsonContent(errors));
            }
        }
        /// <summary>
        /// 既存のRowを一覧検索する Web API
        /// </summary>
        [HttpPost("load")]
        public virtual IActionResult Load([FromBody]RowSearchCondition? filter, [FromQuery] int? skip, [FromQuery] int? take) {
            var instances = _applicationService.LoadRow(filter, skip, take);
            return this.JsonContent(instances.ToArray());
        }
        /// <summary>
        /// 既存のRowをキーワードで一覧検索する Web API
        /// </summary>
        [HttpGet("list-by-keyword")]
        public virtual IActionResult SearchByKeywordxc431ca892f0ec48c9bbc3311bb00c38c([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordRow(keyword);
            return this.JsonContent(items);
        }
        /// <summary>
        /// 既存のAttrsをキーワードで一覧検索する Web API
        /// </summary>
        [HttpGet("list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc")]
        public virtual IActionResult SearchByKeywordx218859120e2951a46aa6ad9fb9e627cc([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordAttrs(keyword);
            return this.JsonContent(items);
        }
        /// <summary>
        /// 既存のRowAttrsRefsをキーワードで一覧検索する Web API
        /// </summary>
        [HttpGet("list-by-keyword-x13a09bd39670c9d07fc4caeb5cd9ed8b")]
        public virtual IActionResult SearchByKeywordx13a09bd39670c9d07fc4caeb5cd9ed8b([FromQuery] string? keyword) {
            var items = _applicationService.SearchByKeywordRowAttrsRefs(keyword);
            return this.JsonContent(items);
        }
    }
}
