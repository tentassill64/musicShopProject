using System.Security.Cryptography;
using System.Text;

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
}
