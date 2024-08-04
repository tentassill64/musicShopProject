using Microsoft.AspNetCore.Mvc;
using musicShopProject.Model.Users;
using musicShopProject.Service;
using musicShopProject.Tools.Types;

namespace musicShopProject.Controllers;

public class ProfileController : ControllerBase
{
    private readonly IUserService _userService;
    public ProfileController(IUserService userService)
    {
        _userService = userService;
    }

    public record ChangeOldPasswordRequest(String? PhoneNumber, String? OldPassword, String? NewPassword);

    [HttpPost("update/password")]
    public Result Update([FromBody] ChangeOldPasswordRequest request)
    {
        return _userService.UpdatePassword(request.PhoneNumber, request.OldPassword, request.NewPassword);
    }

    [HttpPost("")]
    public Result SetEmail([FromBody] UserBlank request)
    {

    }
}
