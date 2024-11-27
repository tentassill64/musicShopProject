using musicShopProject.Tools.Types;
using System.Net;
using System.IO;

namespace musicShopProject.Service.Products
{
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
            if (!result.IsSuccess) return Result.Fail(result.ErrorsAsString);

            List<String> imagePaths = new();

            String baseDirectory = AppContext.BaseDirectory;

            String relativePath = Path.Combine("ClientApp", "public", "images", "products");
            String targetDirectory = Path.Combine(baseDirectory, "..", "..", "..", relativePath);

            if (!Directory.Exists(targetDirectory))
            {
                Directory.CreateDirectory(targetDirectory);
            }

            foreach (String image in images)
            {
                using WebClient webClient = new();

                byte[] imageBytes = webClient.DownloadData(image);

                String fileName = Guid.NewGuid().ToString() + ".png";
                String filePath = Path.Combine(targetDirectory, fileName);

                File.WriteAllBytes(filePath, imageBytes);

                imagePaths.Add(fileName);
            }

            imagesPaths = imagePaths.ToArray();

            return Result.Success();
        }

        private Result ValidateImages(String[] images)
        {
            foreach (String image in images)
            {
                if (!Uri.IsWellFormedUriString(image, UriKind.Absolute)) return Result.Fail($"Неправильная ссылка: {image}");
            }
            return Result.Success();
        }
    }
}
