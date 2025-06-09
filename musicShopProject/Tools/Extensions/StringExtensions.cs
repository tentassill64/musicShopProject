using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace musicShopProject.Tools.Extensions;

public static class StringExtensions
{
    public static Boolean IsNullOrWhiteSpace(this String? str)
    {
        return String.IsNullOrWhiteSpace(str);
    }

    public static String GetHash(this String input)
    {
        using MD5 md5 = MD5.Create();

        Byte[] inputBytes = Encoding.Unicode.GetBytes(input);
        Byte[] hashBytes = md5.ComputeHash(inputBytes);

        return Convert.ToHexString(hashBytes);
    }

    public static bool IsUrlValid(this String url)
    {
        string pattern = @"^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$";
        return !Regex.IsMatch(url, pattern, RegexOptions.IgnoreCase);
    }
}
