namespace Katchly {
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;

    internal static class DefaultConfigurationInCli {
        /// <summary>
        /// バッチプロセス起動時初期設定
        /// </summary>
        internal static void InitAsBatchProcess(this IServiceCollection services) {
            DefaultConfiguration.ConfigureServices(services);

        }
    }

}
