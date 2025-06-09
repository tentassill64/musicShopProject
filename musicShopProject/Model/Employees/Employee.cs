using System.Text.Json.Serialization;

namespace musicShopProject.Model.Employees;

public class Employee
{
    public Guid Id { get; }

    [JsonIgnore]
    public String PasswordHash { get; }

    public String Email { get; }

    public String? PhoneNumber { get; }

    public Employee(Guid id, String email, String? phoneNumber)
    {
        Id = id;
        Email = email;
        PhoneNumber = phoneNumber;
    }
}
