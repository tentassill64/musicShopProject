using musicShopProject.Model.Employees;

namespace musicShopProject.Service.Employees.Repository;

public interface IEmployeeRepository
{
    Employee? GetEmployee(Guid employeeId);

    Employee? GetEmployee(String email, String password);
}
