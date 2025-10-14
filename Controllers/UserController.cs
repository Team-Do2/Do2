using Do2.Contracts.DatabaseModels;
using Do2.Contracts.DTOs;
using Do2.Contracts.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Do2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService userService;
        public UserController(IUserService _userService)
        {
            userService = _userService;
        }

        [HttpPost("CreateUserCredentials")]
        public async Task<bool> CreateUserCredentials(CreateUserCredentialsRequest userRequest) {
            return await userService.CreateUser(new BasicUserInformation()
            {
                Email = userRequest.Email,
                Password = userRequest.Password,
                FirstName = userRequest.FirstName,
                LastName = userRequest.LastName
            });
        }

        [HttpPost("DeleteUserCredentials")]
        public async Task<bool> DeleteUserCredentials(DeleteUserRequest userRequest) {
            return await userService.DeleteUser(userRequest.Email);
        }
    }
}
