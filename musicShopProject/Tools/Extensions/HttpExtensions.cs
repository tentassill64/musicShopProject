using Microsoft.AspNetCore.Mvc.Controllers;

namespace musicShopProject.Tools.Extensions;

public static class HttpExtensions
{
    public static Boolean IsAjaxRequest(this HttpRequest request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        if (request.Headers != null)
            return request.Headers["X-Requested-With"] == "XMLHttpRequest";

        return false;
    }

    public static Boolean EndpointHasAttribute<T>(this HttpContext context) where T : Attribute
    {
        Boolean? isEndpointHasAttribute = context.GetEndpoint()
            ?.Metadata
            .GetMetadata<ControllerActionDescriptor>()
            ?.MethodInfo
            .GetCustomAttributes(inherit: true)
            .OfType<T>()
            .Any();

        return isEndpointHasAttribute ?? false;
    }


    public static T[] GetAttributes<T>(this HttpContext context) where T : Attribute
    {
        return context.GetEndpoint()
            ?.Metadata
            .GetMetadata<ControllerActionDescriptor>()
            ?.MethodInfo
            .GetCustomAttributes(inherit: true)
            .OfType<T>()
            .ToArray() ?? new T[0];
    }
}
