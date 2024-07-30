using musicShopProject.Service;
using musicShopProject.Service.Categories;
using musicShopProject.Service.Categories.Repository;
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
        #region Services

        collection.AddSingleton<IUserService, UserService>();
        collection.AddSingleton<IProductService, ProductService>();
        collection.AddSingleton<IImageService, ImageService>();
        collection.AddSingleton<ICategoryService, CategoryService>();

        #endregion Services

        #region Repositories

        collection.AddSingleton<IUserRepository, UserRepository>();
        collection.AddSingleton<IProductRepository, ProductRepository>();
        collection.AddSingleton<ICategoryRepository, CategoryRepository>();

        #endregion Repositories

        IConfiguration configuration = new ConfigurationBuilder()
        .AddJsonFile($"appsettings.{environment}.json", optional: false)
        .Build();

        collection.AddSingleton<IMainConnector>(new MainConnector(configuration.GetConnectionString("Main")!));
    }
}
