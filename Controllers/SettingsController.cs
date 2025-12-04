using Microsoft.AspNetCore.Mvc;
using Do2.Services;
using Do2.Models;

namespace Do2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly SettingsService _settingsService;

        public SettingsController(SettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        [HttpGet("{email}")]
        public async Task<ActionResult<Settings?>> GetSettings(string email)
        {
            var settings = await _settingsService.GetSettingsByEmailAsync(email);
            if (settings == null)
                return NotFound();
            return Ok(settings);
        }

        [HttpPut("theme")]
        public async Task<IActionResult> UpdateTheme([FromBody] UpdateThemeRequest request)
        {
            var success = await _settingsService.UpdateSettingsThemeAsync(request.Email, request.Theme);
            if (!success)
                return BadRequest();
            return NoContent();
        }

        [HttpPut("time-to-delete")]
        public async Task<IActionResult> UpdateTimeToDelete([FromBody] UpdateTimeToDeleteRequest request)
        {
            var success = await _settingsService.UpdateSettingsTimeToDeleteAsync(request.Email, request.TimeToDelete);
            if (!success)
                return BadRequest();
            return NoContent();
        }
    }

    public class UpdateThemeRequest
    {
        public string Email { get; set; } = string.Empty;
        public Themes Theme { get; set; }
    }

    public class UpdateTimeToDeleteRequest
    {
        public string Email { get; set; } = string.Empty;
        public int TimeToDelete { get; set; }
    }
}
