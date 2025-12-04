using Do2.Models;
using Do2.Repositories;

namespace Do2.Services
{
    public class SettingsService
    {
        private readonly SettingsRepository _settingsRepository;

        public SettingsService(SettingsRepository settingsRepository)
        {
            _settingsRepository = settingsRepository;
        }

        public async Task<Settings?> GetSettingsByEmailAsync(string email)
        {
            return await _settingsRepository.GetSettingsByEmailAsync(email);
        }

        public async Task<bool> UpdateSettingsThemeAsync(string email, Themes theme)
        {
            return await _settingsRepository.UpdateSettingsThemeAsync(email, theme);
        }

        public async Task<bool> UpdateSettingsTimeToDeleteAsync(string email, int timeToDelete)
        {
            return await _settingsRepository.UpdateSettingsTimeToDeleteAsync(email, timeToDelete);
        }

        public async Task<bool> CreateSettingsForUserAsync(string email, Themes theme, int timeToDelete)
        {
            return await _settingsRepository.CreateSettingsForUserAsync(email, theme, timeToDelete);
        }
    }
}
