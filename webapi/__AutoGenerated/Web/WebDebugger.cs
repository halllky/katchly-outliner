using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace FlexTree;

#if DEBUG
[ApiController]
[Route("[controller]")]
public class WebDebuggerController : ControllerBase {
  public WebDebuggerController(ILogger<WebDebuggerController> logger, IServiceProvider provider) {
    _logger = logger;
    _provider = provider;
  }
  private readonly ILogger<WebDebuggerController> _logger;
  private readonly IServiceProvider _provider;

  [HttpPost("recreate-database")]
  public HttpResponseMessage RecreateDatabase() {
    var dbContext = _provider.GetRequiredService<FlexTree.MyDbContext>();
    dbContext.Database.EnsureDeleted();
    dbContext.Database.EnsureCreated();
    return new HttpResponseMessage {
      StatusCode = System.Net.HttpStatusCode.OK,
      Content = new StringContent("DBを再作成しました。"),
    };
  }

  [HttpGet("secret-settings")]
  public IActionResult GetSecretSettings() {
    var runtimeSetting = _provider.GetRequiredService<RuntimeSettings.Server>();
    return this.JsonContent(runtimeSetting);
  }
  [HttpPost("secret-settings")]
  public IActionResult SetSecretSettings([FromBody] RuntimeSettings.Server settings) {
    var json = settings.ToJson();
    using var sw = new System.IO.StreamWriter("nijo-runtime-config.json", false, new System.Text.UTF8Encoding(false));
    sw.WriteLine(json);
    return Ok();
  }
}
#endif
