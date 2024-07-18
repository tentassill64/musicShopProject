using Microsoft.AspNetCore.Mvc;
using musicShopProject.Model.Users;
using musicShopProject.Service;
using musicShopProject.Tools.Types;

namespace musicShopProject.Controllers;

public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public Result Register([FromBody] UserBlank blank) 
    {
       return _userService.Register(blank);
    }
    
    public record LoginRequest(String? Login, String? Password);

    [HttpPost("login")]
    public Result Login([FromBody] LoginRequest loginRequest)
    {
        return _userService.Login(loginRequest.Login, loginRequest.Password);
    }
}
