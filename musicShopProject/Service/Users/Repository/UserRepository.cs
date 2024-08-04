using musicShopProject.Model.Users;
using musicShopProject.Service.Users.Repository.Converters;
using musicShopProject.Service.Users.Repository.Models;
using musicShopProject.Tools.DataBase.Interfaces;
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
        String query = @$"INSERT INTO users (id, phonenumber, passwordhash, email, 
                       createddatetimeutc, modifieddatetimeutc, isremoved, birthdate) 
                       VALUES (@p_id, @p_phonenumber, @p_passwordhash, null, @p_datetimeutc, 
                       null, false, null) 
                       ON CONFLICT (id) 
                       DO UPDATE SET
                       passwordhash = CASE WHEN @p_passwordbechanged THEN @p_passwordhash ELSE users.passwordhash END,
                       modifieddatetimeutc = @p_datetimeutc";

        NpgsqlParameter[] parameters = {
            new ("p_id", validatedBlank.Id),
            new ("p_phonenumber", validatedBlank.PhoneNumber),
            new ("p_passwordhash", validatedBlank.Password.Hash),
            new ("p_datetimeutc", DateTime.UtcNow),
            new ("p_passwordbechanged", validatedBlank.PasswordBeChanged)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }

    public User? GetUser(String phoneNumber)
    {
        String query = "SELECT * FROM users WHERE phonenumber = @p_phonenumber";

        NpgsqlParameter[] parameters = { new("p_phonenumber", phoneNumber) };
        UserDB? userDB = _mainConnector.Get<UserDB?>(query, parameters);

        return userDB?.ToUser();
    }

    public User? GetUserByEmail(String phoneNumber, String passwordHash)
    {
        String query = $"SELECT * FROM users WHERE phonenumber = @p_phonenumber AND passwordhash = @p_passwordhash";

        NpgsqlParameter[] parameters =
        {
            new("p_phonenumber", phoneNumber),
            new ("p_passwordhash",passwordHash)
        };

        UserDB? userDB = _mainConnector.Get<UserDB?>(query, parameters);

        return userDB?.ToUser();
    }

    public void UpdateUserPassword(Guid id, String newPassword)
    {
        String query = @"UPDATE users 
                       SET passwordhash = @p_passwordhash 
                       WHERE id = @p_id";

        NpgsqlParameter[] parameters =
        {
            new("p_passwordhash", newPassword),
            new("p_id",id)
        };

        _mainConnector.ExecuteNonQuery(query,parameters);
    }

    public User? GetUserByPhoneNumber(String phoneNumber, String passwordHash)
    {
        String query = @"SELECT * FROM users 
                         WHERE phonenumber = @p_phonenumber AND passwordhash = @p_passwordhash";

        NpgsqlParameter[] parametrs =
        {
            new ("p_phonenumber", phoneNumber),
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

    public User[] GetUsers(Guid[] ids)
    {
        String query = "SELECT * FROM users WHERE id = ANY(@p_ids)";

        NpgsqlParameter parameter = new("p_ids",ids);

        return _mainConnector.GetArray<UserDB>(query, parameter)
            .Select(u => u.ToUser()).ToArray();
    }

    public User[] GetAllUsers()
    {
        String query = "SELECT * FROM users";

        IEnumerable<UserDB> userDBs = _mainConnector.GetArray<UserDB>(query);

        return userDBs.Select(userDB => userDB.ToUser()).ToArray();
    }
}
