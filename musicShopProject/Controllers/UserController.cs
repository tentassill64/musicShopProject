using Microsoft.AspNetCore.Authorization;
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
    
    public record LoginRequest(String? PhoneNumber, String? Password);

    [HttpPost("login")]
    public DataResult<User> Login([FromBody] LoginRequest loginRequest)
    {
        return _userService.Login(loginRequest.PhoneNumber, loginRequest.Password);
    }

    [AllowAnonymous]
    [HttpGet("Users/Get/All")]
    public User[] GetAllUsers()
    {
        return _userService.GetAllUsers();
    }

    [HttpGet("User/Phone")]
    public User? GetUser([FromQuery] String phoneNumber)
    {
       return _userService.GetUser(phoneNumber);
    }
}
