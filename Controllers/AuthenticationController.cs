using Do2.Services;
using Microsoft.AspNetCore.Mvc;

namespace Do2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        // private readonly TaskService _service; //TaskService service
        public AuthenticationController()
        {

        }

        [HttpPost]
        public async void CreateUserCredentials() {

        }

        [HttpPost]
        public async void AuthenticateUser() {
            
        }
    }
}