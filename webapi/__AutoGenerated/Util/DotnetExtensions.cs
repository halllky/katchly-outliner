namespace Katchly {
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.Json;
    using Microsoft.AspNetCore.Mvc;

    public static class DotnetExtensionsInWebApi {
        public static IActionResult JsonContent<T>(this ControllerBase controller, T obj) {
            var json = Util.ToJson(obj);
            return controller.Content(json, "application/json");
        }
    }
}
