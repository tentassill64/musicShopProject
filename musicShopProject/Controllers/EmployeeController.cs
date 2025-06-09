using Microsoft.AspNetCore.Mvc;
using musicShopProject.Model.Employees;
using musicShopProject.Service;
using musicShopProject.Tools.Types;

namespace musicShopProject.Controllers;

public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeeController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    public record EmployeeLoginRequest(String? Email, String? Password);
    [HttpPost("Employee/Login")]
    public Result Login([FromBody] EmployeeLoginRequest employeeLoginRequest)
    {
       return _employeeService.Login(employeeLoginRequest.Password, employeeLoginRequest.Email);
    }

    [HttpGet("Employee/Get")]
    public Employee GetEmployee(String email, String password) 
    {
        return _employeeService.GetEmployee(email, password);
    }
}
