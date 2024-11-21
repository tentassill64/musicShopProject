using Microsoft.AspNetCore.Authorization;
using musicShopProject.Model.Users;
using musicShopProject.Service;
using musicShopProject.Tools.Extensions;
using System.Net;

namespace musicShopProject.Tools.Infrastructure;

public class Middleware
{
    private readonly RequestDelegate _next;
    private readonly IUserService _usersService;

    public Middleware(RequestDelegate next, IUserService usersService)
    {
        _next = next;
        _usersService = usersService;
    }


    public async Task Invoke(HttpContext context)
    {
        try
        {
            SystemUser? systemUser = GetSystemUser(context);
            context.Items[CookieKeys.SystemUser] = systemUser;

            Boolean isAllowAnonymousMethod = context.EndpointHasAttribute<AllowAnonymousAttribute>();
            if (!isAllowAnonymousMethod)
            {
                await _next.Invoke(context);
                return;
            };

            if (systemUser is null)
                throw new UnauthenticatedException();

            await _next.Invoke(context);
        }
        catch (Exception exception)
        {
            if (exception is UnauthenticatedException)
                SetUnauthenticated(context);

            else throw;
        }
    }

    private SystemUser? GetSystemUser(
        HttpContext context
    )
    {
        IRequestCookieCollection cookies = context.Request.Cookies;
        if (!cookies.ContainsKey(CookieKeys.SystemUser)) return null;

        String? token = cookies[CookieKeys.SystemUser];
        if (token is null) return null;

        //User? user = _usersService.GetUserByToken(token);

        User? user = new(Guid.NewGuid(), "+7777777", "", DateOnly.MaxValue);

        if (user is null) return null;

        return new SystemUser(user);
    }

    private void SetUnauthenticated(HttpContext context)
    {
        if (context.Request.IsAjaxRequest())
        {
            ClearAjaxRequest(context);
        }
        else
        {
            context.Response.Cookies.Delete(CookieKeys.SystemUser);
            context.Response.Redirect("/login");
        }
    }

    private void ClearAjaxRequest(HttpContext context)
    {
        context.Response.Clear();
        context.Response.StatusCode = (Int32)HttpStatusCode.Forbidden;
    }

    private class UnauthenticatedException : Exception { }
}
