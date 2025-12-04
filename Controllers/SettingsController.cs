using Microsoft.AspNetCore.Mvc;
using Do2.Services;
using Do2.Models;
using System;

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

        [HttpPatch("theme")]
        public async Task<IActionResult> UpdateTheme([FromBody] UpdateThemeRequest request)
        {
            if (!Enum.TryParse<Themes>(request.Theme, true, out var theme))
            {
                return BadRequest("Invalid theme");
            }
            var success = await _settingsService.UpdateSettingsThemeAsync(request.Email, theme);
            if (!success)
                return BadRequest();
            return NoContent();
        }

        [HttpPatch("time-to-delete")]
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
        public string Theme { get; set; } = string.Empty;
    }

    public class UpdateTimeToDeleteRequest
    {
        public string Email { get; set; } = string.Empty;
        public int TimeToDelete { get; set; }
    }
}
