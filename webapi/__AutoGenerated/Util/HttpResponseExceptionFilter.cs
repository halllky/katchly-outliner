namespace Katchly {
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microsoft.AspNetCore.Mvc;
    using System.Net;
    using System.Text.Json;
    using Microsoft.AspNetCore.Http.Extensions;

    public class HttpResponseExceptionFilter : IActionFilter {
        public HttpResponseExceptionFilter(ILogger logger) {
            _logger = logger;
        }
        private readonly ILogger _logger;

        public void OnActionExecuting(ActionExecutingContext context) { }

        public void OnActionExecuted(ActionExecutedContext context) {
            if (context.Exception != null) {
                _logger.LogCritical(context.Exception, "Internal Server Error: {Url}", context.HttpContext.Request.GetDisplayUrl());

                context.Result = ((ControllerBase)context.Controller).JsonContent(new {
                    content = Util.ToJson(new[] {
                        context.Exception.ToString(),
                    }),
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.ExceptionHandled = true;
            }
        }
    }
}
