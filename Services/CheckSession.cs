using Do2.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Do2.Services;

public class CheckSession : ActionFilterAttribute
{
    private const string ValidCookieName = "AuthToken";
    private ISessionService sessionService;
    private ILogger logger;
    public CheckSession(ISessionService _sessionService, ILogger _logger)
    {
        sessionService = _sessionService;
        logger = _logger;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var cookieValue = context.HttpContext.Request.Cookies[ValidCookieName];

        if (string.IsNullOrEmpty(cookieValue) || !sessionService.ValidateSession(cookieValue))
        {
            logger.LogCritical(context.HttpContext.Request.Host + " attempted to get in.");
            context.Result = new UnauthorizedResult();
            return;
        }
            
        base.OnActionExecuting(context);
    }
}