namespace musicShopProject.Model.Users;

public class User
{
    public Guid Id { get; }
    public String Login { get; }
    public String Email { get; }

    public User(Guid id, String login, String email)
    {
        Id = id;
        Login = login;
        Email = email;
    }
}
