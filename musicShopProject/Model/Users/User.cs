using System.Text.Json.Serialization;

namespace musicShopProject.Model.Users;

public class User
{
    public Guid Id { get; }
    public String Login { get; }
    public String Email { get; }
    //TODO допиши везде 
    [JsonIgnore]
    public String PasswordHash { get; }

    public User(Guid id, String login, String email)
    {
        Id = id;
        Login = login;
        Email = email;
    }
}
