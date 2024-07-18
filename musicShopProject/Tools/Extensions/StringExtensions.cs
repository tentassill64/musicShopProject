using System.Security.Cryptography;

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

        byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
        byte[] hashBytes = md5.ComputeHash(inputBytes);

        return Convert.ToHexString(hashBytes);
    }
}
