using System.Text.Json.Serialization;

namespace musicShopProject.Model.Users;

//Client
public class User
{
    public Guid Id { get; }
    public String PhoneNumber { get; }
    public String? Email { get; }
    [JsonIgnore]
    public String PasswordHash { get; }

    public User(Guid id, String phoneNumber, String? email)
    {
        Id = id;
        PhoneNumber = phoneNumber;
        Email = email;
    }
}
