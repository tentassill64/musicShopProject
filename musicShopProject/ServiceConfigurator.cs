using Microsoft.Extensions.DependencyInjection;
using musicShopProject.Service;
using musicShopProject.Service.Products;
using musicShopProject.Service.Products.Repository;
using musicShopProject.Service.Users;
using musicShopProject.Service.Users.Repository;
using musicShopProject.Tools.DataBase;
using musicShopProject.Tools.DataBase.Interfaces;

namespace musicShopProject;

public static class ServiceConfigurator
{
    public static void Initialize(this IServiceCollection collection, String environment)
    {
        collection.AddSingleton<IUserService, UserService>();
        collection.AddSingleton<IUserRepository, UserRepository>();
        collection.AddSingleton<IProductService, ProductService>();
        collection.AddSingleton<IProductRepository, ProductRepository>();
        
        IConfiguration configuration = new ConfigurationBuilder()
        .AddJsonFile($"appsettings.{environment}.json", optional: false)
        .Build();

        collection.AddSingleton<IMainConnector>(new MainConnector(configuration.GetConnectionString("Main")!));
    }
}
