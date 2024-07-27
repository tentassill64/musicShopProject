using musicShopProject.Tools.Types;
using System.Net;

namespace musicShopProject.Service.Products;`1

public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _environment;

    public ImageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }
    public Result Save(String[] images, out String[] imagesPaths)
    {
        imagesPaths = null!;

        Result result = ValidateImages(images);
        if(!result.IsSuccess) return Result.Fail(result.ErrorsAsString);

        List<String> imagePaths = new();

        foreach (String image in images)
        {
            using WebClient webClient = new();

            Byte[] imageBytes = webClient.DownloadData(image);

            String fileName = Guid.NewGuid().ToString() + ".png";

            File.WriteAllBytes(_environment.WebRootPath + "/img/" + fileName, imageBytes);

            imagePaths.Add(_environment.WebRootPath + "/img/" + fileName);
        }

        imagesPaths = imagePaths.ToArray();

        return Result.Success();
    }

    private Result ValidateImages(String[] images)
    {
        foreach (String image in images) 
        {
            if (!Uri.IsWellFormedUriString(image, UriKind.Absolute)) return Result.Fail($"Неправильная ссылка" + image);
        }
        return Result.Success();
    }
}