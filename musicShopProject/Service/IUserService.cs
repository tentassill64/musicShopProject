using musicShopProject.Model.Users;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service;
public interface IUserService
{
    Result Login(String? phoneNumber, String? password);
    Result Register(UserBlank blank);
    Result UpdatePassword(String? email, String? oldPassword, String? newPassword);
    User[] GetAllUsers();
    User? GetUser(String phoneNumber);
    User? GetUserByToken(String email);
}
