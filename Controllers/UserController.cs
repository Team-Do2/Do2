using Do2.DTOs;
using Do2.Services;
using Microsoft.AspNetCore.Mvc;
using Do2.Models;

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
                Email = userRequest.Email.ToLower(),
                Password = userRequest.Password,
                FirstName = userRequest.FirstName,
                LastName = userRequest.LastName
            });
        }

        [HttpPost("DeleteUserCredentials")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<bool> DeleteUserCredentials(DeleteUserRequest userRequest) {
            return await userService.DeleteUser(userRequest.Email);
        }

        [HttpGet]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<UserInformationResponse> GetUser(string email) {
            return await userService.GetUser(email);
        }

        [HttpPost("UpdateEmail")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<IActionResult> UpdateEmail(UpdateEmailRequest request) {
            var result = await userService.UpdateEmail(request);
            if (!result) {
                return BadRequest("Invalid password or email provided.");
            }
            return Ok(true);
        }

        [HttpPost("ChangePassword")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request) {
            var result = await userService.ChangePassword(request);
            if (!result) {
                return BadRequest("Invalid current password provided.");
            }
            return Ok(true);
        }
    }
}
