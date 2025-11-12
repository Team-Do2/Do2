using Do2.DTOs;
using Do2.Services;
using Microsoft.AspNetCore.Mvc;

namespace Do2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        static TimeSpan MaxSessionLength = new TimeSpan(2, 0, 0); 
        
        private IAuthenticationService authenticationService;
        private ISessionService sessionService;
        public AuthenticationController(IAuthenticationService _authenticationService, ISessionService _sessionService)
        {
            authenticationService = _authenticationService;
            sessionService = _sessionService;
        }

        [HttpPost("AuthenticateUser")]
        public async Task<string> AuthenticateUser(AuthenticateUserRequest request) {

            bool isAuthenticated = await authenticationService.CheckUserHash(request.Email, request.Password);

            if (!isAuthenticated)
                throw new UnauthorizedAccessException();

            var cookie = sessionService.CreateSession(request.Email, MaxSessionLength);

            HttpContext.Response.Cookies.Append("AuthToken", cookie);

            return cookie;
        }
    }
}