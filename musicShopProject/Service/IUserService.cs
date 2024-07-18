using musicShopProject.Model.Users;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service;
public interface IUserService
{
    Result Register(UserBlank blank);
    Result Login(String? login, String? password);
    Result UpdatePassword(String? email, String? oldPassword, String? newPassword);
}
