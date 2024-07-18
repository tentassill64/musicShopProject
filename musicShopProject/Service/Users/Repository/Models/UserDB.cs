namespace musicShopProject.Service.Users.Repository.Models;

public class UserDB
{
    public Guid Id { get; set; }
    public String Login { get; set; }
    public String Password { get; set; }
    public String Email { get; set; }
    public DateTime CreateDateTime { get; set; }
    public DateTime? UpdateDateTime { get; set; }
}
