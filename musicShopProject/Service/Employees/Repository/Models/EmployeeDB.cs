namespace musicShopProject.Service.Employees.Repository.Models;

public class EmployeeDB
{
    public Guid Id { get; set; }
    public String Password { get; set; }
    public String Email { get; set; }
    public DateTime CreateDateTimeUtc { get; set; }
    public DateTime? ModifiedDateTimeUtc { get; set; }
    public Boolean IsRemoved { get; set; }
    public String? PhoneNumber { get; set; }
}
