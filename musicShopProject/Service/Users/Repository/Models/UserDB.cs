namespace musicShopProject.Service.Users.Repository.Models;

public class UserDB
{
    public Guid Id { get; set; }
    public String PhoneNumber { get; set; }
    public String Password { get; set; }
    public String? Email { get; set; }
    public DateTime CreateDateTimeUtc { get; set; }
    public DateTime? ModifiedDateTimeUtc { get; set; }
    public Boolean IsRemoved { get; set; }
}
