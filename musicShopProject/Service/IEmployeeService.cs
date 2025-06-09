using musicShopProject.Model.Employees;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service;

public interface IEmployeeService
{
    Result Login(String? password, String? email);

    Employee? GetEmployee(String email, String password);

    Employee? GetEmployee(Guid id);

}
