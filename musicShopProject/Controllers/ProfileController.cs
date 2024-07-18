using Microsoft.AspNetCore.Mvc;
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

    public record ChangeOldPasswordRequest(String? Email, String? OldPassword, String? NewPassword);

    [HttpPost("update/password")]
    public Result Update([FromBody] ChangeOldPasswordRequest request)
    {
        return _userService.UpdatePassword(request.Email, request.OldPassword, request.NewPassword);
    }
}
