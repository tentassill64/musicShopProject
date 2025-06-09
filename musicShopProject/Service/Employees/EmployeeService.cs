using musicShopProject.Model.Employees;
using musicShopProject.Model.Users;
using musicShopProject.Service.Employees.Repository;
using musicShopProject.Tools.Extensions;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Employees;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;

    public EmployeeService(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public Employee? GetEmployee(String email, String password)
    {
       return _employeeRepository.GetEmployee(email, password);
    }

    public Employee? GetEmployee(Guid id)
    {
        return _employeeRepository.GetEmployee(id);
    }

    public Result Login(String? password, String? email)
    {
        if (email.IsNullOrWhiteSpace()) return Result.Fail("Укажите почту");
        if (password.IsNullOrWhiteSpace()) return Result.Fail("Укажите пароль");

        Employee? employee = GetEmployee(email!, password!);
        if (employee is null) return Result.Fail("Такого пользователя не существует");

        return Result.Success();
    }
}
