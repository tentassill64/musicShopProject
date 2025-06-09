using musicShopProject.Model.Employees;
using musicShopProject.Service.Employees.Repository.Converters;
using musicShopProject.Service.Employees.Repository.Models;
using musicShopProject.Tools.DataBase.Interfaces;
using musicShopProject.Tools.Extensions;
using Npgsql;

namespace musicShopProject.Service.Employees.Repository;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly IMainConnector _mainConnector;
    public EmployeeRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }
    public Employee? GetEmployee(Guid employeeId)
    {
        String query = @$"SELECT * FROM employees WHERE id = @p_id";

        NpgsqlParameter[] paramerts = 
        {
            new ("p_id", employeeId),
        };

        EmployeeDB? employee = _mainConnector.Get<EmployeeDB>(query, paramerts);

        return employee?.ToEmployee();
    }

    public Employee? GetEmployee(String email, String password)
    {
        String query = @$"SELECT * FROM employees WHERE email = @p_email AND passwordhash = @p_password";

        NpgsqlParameter[] paramerts =
        {
            new ("p_email", email),
            new ("p_password", password.GetHash())
        };

        EmployeeDB? employee = _mainConnector.Get<EmployeeDB>(query, paramerts);

        return employee?.ToEmployee();
    }
}
