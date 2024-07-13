using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Katchly {
    /// <summary>
    /// DB定義更新スクリプト作成に関するコマンド `dotnet ef migrations add` の際に呼ばれるファクトリークラス
    /// </summary>
    internal class MyDbContextFactoryForMigration : IDesignTimeDbContextFactory<MyDbContext> {
        public MyDbContext CreateDbContext(string[] args) {
            var serviceCollection = new ServiceCollection();
            DefaultConfiguration.ConfigureServices(serviceCollection);
            var services = serviceCollection.BuildServiceProvider();
            return services.GetRequiredService<MyDbContext>();
        }
    }
}
