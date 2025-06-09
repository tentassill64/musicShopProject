using musicShopProject.Model.Users;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service;
public interface IUserService
{
    DataResult<User> Login(String? phoneNumber, String? password);
    Result Register(UserBlank blank);
    Result UpdatePassword(String? email, String? oldPassword, String? newPassword);
    User[] GetAllUsers();
    User[] GetUsers(Guid[] usersIds);
    User? GetUser(String phoneNumber);
    User? GetUserByToken(String email);
}
