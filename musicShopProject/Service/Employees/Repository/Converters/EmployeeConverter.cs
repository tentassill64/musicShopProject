using musicShopProject.Model.Employees;
using musicShopProject.Model.Users;
using musicShopProject.Service.Employees.Repository.Models;

namespace musicShopProject.Service.Employees.Repository.Converters;

public static class EmployeeConverter
{
    public static Employee ToEmployee(this EmployeeDB db)
    {
        return new Employee(db.Id, db.Email, db.PhoneNumber);
    }
}
