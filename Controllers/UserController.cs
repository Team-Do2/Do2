using Do2.DTOs;
using Do2.Services;
using Microsoft.AspNetCore.Mvc;
using Do2.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Do2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService _userService, ILogger _logger) : ControllerBase
    {
        private readonly IUserService userService = _userService;
        private readonly ILogger logger = _logger;

        [HttpPost("CreateUserCredentials")]
        public async Task<IActionResult> CreateUserCredentials(CreateUserCredentialsRequest userRequest) {
            try
            {
                await userService.CreateUser(new BasicUserInformation()
                {
                    Email = userRequest.Email.ToLower(),
                    Password = userRequest.Password,
                    FirstName = userRequest.FirstName,
                    LastName = userRequest.LastName
                });

                logger.LogInformation("User created for " + userRequest.Email);
            } 
            catch (System.Data.Common.DbException ex)
            {
                // 409 Conflict: Indicates a request conflict with the current state of the target resource.
                // Used when trying to create a resource that already exists (like a user with a duplicate email/ID).
                logger.LogWarning(ex.Message, ex);
                return BadRequest("User email is already taken");
            } 
            catch (Exception ex)
            {
                logger.LogCritical("User creation utterly failed " + userRequest.Email);
                logger.LogCritical(ex.Message);

                return StatusCode(500, "An internal error occurred during user creation."); // This is what we call bad programming
            }

            return Created();
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
