using System.Text.Json.Serialization;

namespace musicShopProject.Model.Users;

//Client
public class User
{
    public Guid Id { get; }
    // убрать логин
    public String Login { get; }
    public String Email { get; }

    //TODO добавить номер телефона 
    // Регистрация - номер телефона + пароль.
    // пользователь в профиле может добавить почту для рассылок 
    // 

    [JsonIgnore]
    public String PasswordHash { get; }

    public User(Guid id, String login, String email)
    {
        Id = id;
        Login = login;
        Email = email;
    }
}
