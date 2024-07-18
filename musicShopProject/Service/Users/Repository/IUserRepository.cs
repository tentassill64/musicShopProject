using musicShopProject.Model.Users;

namespace musicShopProject.Service.Users.Repository;

public interface IUserRepository
{
    void Save(UserBlank.Validated validatedBlank);

    User? GetUserByEmail(String email, String passwordHash);

    User? GetUser(String login);

    User? GetUserByLogin(String login, String passwordHash);

    void UpdateUserPassword(Guid id, String newPassword);

    User[]? GetUsers(Guid[] ids);

    User? GetUser(Guid id);

    User[] GetAllUsers();
}
