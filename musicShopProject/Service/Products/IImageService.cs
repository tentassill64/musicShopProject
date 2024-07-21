using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Products;

public interface IImageService
{
    Result Save(String[] Images, out String[] imagesPaths);
}
