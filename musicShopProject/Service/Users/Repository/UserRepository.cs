using musicShopProject.Model.Users;
using musicShopProject.Service.Users.Repository.Converters;
using musicShopProject.Service.Users.Repository.Models;
using musicShopProject.Tools.DataBase.Interfaces;
using musicShopProject.Tools.Extensions;
using Npgsql;

namespace musicShopProject.Service.Users.Repository;


public class UserRepository : IUserRepository
{
    private readonly IMainConnector _mainConnector;
    public UserRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }

    public void Save(UserBlank.Validated validatedBlank)
    {
        //TODO Вынести в переменные все {} 
        String query = $"INSERT INTO users (id, login, passwordhash, createdatetime, updatedatetime, email)" +
                       $"VALUES (@p_id, @p_login, @p_passwordhash, @p_createdatetime, null, @p_email)" +
                       $"ON CONFLICT (id) DO UPDATE SET " +
                       $"login = @p_login," +
                       $"passwordhash = CASE WHEN @p_passwordbechanged THEN @p_passwordhash ELSE users.passwordhash END," +
                       $"updatedatetime = @p_updatedatetime," +
                       $"email = @p_email";

        NpgsqlParameter[] parameters = new NpgsqlParameter[] {
            new ("p_id", validatedBlank.Id),
            new ("p_login", validatedBlank.Login),
            new ("p_passwordhash", validatedBlank.Password.GetHash()),
            new ("p_email", validatedBlank.Email),
            new ("p_createdatetime",DateTime.UtcNow),
            new ("p_updatedatetime",DateTime.UtcNow),
            new ("p_passwordbechanged",validatedBlank.PasswordBeChanged)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }

    public User? GetUser(String login)
    {
        String query = "SELECT * FROM users WHERE login = @p_login";

        NpgsqlParameter[] parametrs = new NpgsqlParameter[]
        {
            new("p_login", login)
        };

        UserDB? userDB = _mainConnector.Get<UserDB?>(query, parametrs);

        return userDB?.ToUser();
    }

    public User? GetUserByEmail(String email, String passwordHash)
    {
        String query = $"SELECT * FROM users WHERE email = @p_email AND passwordhash = @p_passwordhash";

        NpgsqlParameter[] parametrs = new NpgsqlParameter[]
        {
            new("p_email", email),
            new ("p_passwordhash",passwordHash)
        };

        UserDB? userDB = _mainConnector.Get<UserDB?>(query,parametrs);

        return userDB?.ToUser();
    }

    public void UpdateUserPassword(Guid id, string newPassword)
    {
        String query = "UPDATE users" +
                   " SET passwordhash = @p_passwordhash" +
                   " WHERE id = @p_id";

        NpgsqlParameter[] parameters = new NpgsqlParameter[]
        {
            new("p_passwordhash", newPassword),
            new("p_id",id)
        };

        _mainConnector.ExecuteNonQuery(query,parameters);
    }

    public User? GetUserByLogin(String login, String passwordHash)
    {
        String query = $"SELECT * FROM users WHERE login = @p_login AND passwordhash = @p_passwordhash";

        NpgsqlParameter[] parametrs =
        {
            new("p_login", login),
            new ("p_passwordhash",passwordHash)
        };

        UserDB? userDB = _mainConnector.Get<UserDB?>(query, parametrs);

        return userDB?.ToUser();
    }

    public User? GetUser(Guid id)
    {
        String query = $"SELECT * FROM users WHERE id = @p_id";

        NpgsqlParameter parameter = new("p_id",id);

        UserDB? userDB = _mainConnector.Get<UserDB?>(query, parameter);

        return userDB?.ToUser();
    }

    public User[]? GetUsers(Guid[] ids)
    {
        String query = $"SELECT * FROM users WHERE id = ANY(@p_ids)";

        NpgsqlParameter parameter = new("p_ids",ids);

        IEnumerable<UserDB>? userDBs = _mainConnector.GetArray<UserDB>(query, parameter);

        return userDBs?.Select(userDB => userDB.ToUser()).ToArray();
    }

    public User[] GetAllUsers()
    {
        string query = "SELECT * FROM users";

        IEnumerable<UserDB> userDBs = _mainConnector.GetArray<UserDB>(query);

        return userDBs.Select(userDB => userDB.ToUser()).ToArray();
    }
}
