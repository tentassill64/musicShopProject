namespace musicShopProject.Model.Users;

public partial class UserBlank
{
    public Guid? Id { get; set; }
    public String? PhoneNumber { get; set; }
    public String? Password { get; set; }
    public Boolean PasswordBeChanged { get; set; }
}

public partial class UserBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public String PhoneNumber { get; }
        public Password Password { get; }
        public Boolean PasswordBeChanged { get; }

        public Validated(Guid id, Password password, String phoneNumber, Boolean passwordBeChanged)
        {
            Id = id;
            Password = password;
            PhoneNumber = phoneNumber;
            PasswordBeChanged = passwordBeChanged;
        }
    }
}