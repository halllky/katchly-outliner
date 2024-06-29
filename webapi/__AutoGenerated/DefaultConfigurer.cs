namespace Katchly {
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;

    internal static class DefaultConfigurationInWebApi {

        /// <summary>
        /// Webサーバー起動時初期設定
        /// </summary>
        internal static void InitWebHostBuilder(this WebApplicationBuilder builder) {
            DefaultConfiguration.ConfigureServices(builder.Services);

            // HTMLのエンコーディングをUTF-8にする(日本語のHTMLエンコード防止)
            builder.Services.Configure<Microsoft.Extensions.WebEncoders.WebEncoderOptions>(options => {
                options.TextEncoderSettings = new System.Text.Encodings.Web.TextEncoderSettings(System.Text.Unicode.UnicodeRanges.All);
            });

            // npm start で実行されるポートがASP.NETのそれと別なので
            builder.Services.AddCors(options => {
                options.AddDefaultPolicy(builder => {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

            builder.Services.AddControllers(option => {
                // エラーハンドリング
                option.Filters.Add<Katchly.HttpResponseExceptionFilter>();

            }).AddJsonOptions(option => {
                // JSON日本語設定
                Util.ModifyJsonSrializerOptions(option.JsonSerializerOptions);
            });

            builder.Services.AddHostedService<BackgroundTaskLauncher>();
        }

        /// <summary>
        /// Webサーバー起動時初期設定
        /// </summary>
        internal static void InitWebApplication(this WebApplication app) {
            // 前述AddCorsの設定をするならこちらも必要
            app.UseCors();

        }
    }

}
