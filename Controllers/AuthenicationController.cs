using Do2.Services;
using Microsoft.AspNetCore.Mvc;

namespace Do2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenicationController : ControllerBase
    {
        // private readonly TaskService _service; //TaskService service
        public AuthenicationController()
        {

        }

        [HttpPost]
        public async void CreateUserCreditionals() {

        }

        [HttpPost]
        public async void AuthenicateUser() {
            
        }
    }
}