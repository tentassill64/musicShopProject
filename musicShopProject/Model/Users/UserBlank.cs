namespace musicShopProject.Model.Users;

public partial class UserBlank
{
    public Guid? Id { get; set; }
    public String? Email { get; set; }
    public String? Login { get; set; }
    public String? Password { get; set; }
    public Boolean PasswordBeChanged { get; set; }
}

public partial class UserBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public String Email { get; }
        public String Login { get; }
        public Password Password { get; }
        public Boolean PasswordBeChanged { get; }

        public Validated(Guid id, String login, Password password, String email, Boolean passwordBeChanged)
        {
            Id = id;
            Login = login;
            Password = password;
            Email = email;
            PasswordBeChanged = passwordBeChanged;
        }
    }
}