using Do2.Contracts.DTOs;
using Do2.Contracts.Services;
using Do2.Services;
using Microsoft.AspNetCore.Mvc;

namespace Do2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private IAuthenticationService authenticationService;
        public AuthenticationController(IAuthenticationService _authenticationService)
        {
            authenticationService = _authenticationService;
        }

        [HttpPost("AuthenticateUser")]
        public async Task<bool> AuthenticateUser(AuthenticateUserRequest request) {
            return await authenticationService.CheckUserHash(request.Email, request.Password);
        }
    }
}