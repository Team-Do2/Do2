using System.Data;
using Dapper;
using Do2.Models;
namespace Do2.Repositories
{
    public class SettingsRepository
    {
        private readonly IDbConnection db;
        private readonly ILogger<SettingsRepository> logger;

        public SettingsRepository(IDbConnection _db, ILogger<SettingsRepository> _logger)
        {
            db = _db;
            logger = _logger;
        }

        public async Task<bool> CreateSettingsForUserAsync(string email, Themes theme, int timeToDelete)
        {
            const string settingsSql = @"
                INSERT INTO settings (user_email, theme, time_to_delete)
                VALUES (@Email, @Theme, @TimeToDelete);";

            var parameters = new
            {
                Email = email,
                Theme = theme.ToString().ToLower(),
                TimeToDelete = timeToDelete
            };

            var rowsAffected = await db.ExecuteAsync(settingsSql, parameters);
            return rowsAffected > 0;
        }

        public async Task<Settings?> GetSettingsByEmailAsync(string email)
        {
            const string sql = @"
                SELECT user_email AS UserEmail, theme AS Theme, time_to_delete AS TimeToDelete
                FROM settings
                WHERE user_email = @Email;";

            return await db.QueryFirstOrDefaultAsync<Settings>(sql, new { Email = email });
        }

        public async Task<bool> UpdateSettingsThemeAsync(string email, Themes theme)
        {
            const string sql = @"
                UPDATE settings
                SET theme = @Theme
                WHERE user_email = @Email;";

            var parameters = new
            {
                Email = email,
                Theme = theme.ToString().ToLower(),
            };

            var rowsAffected = await db.ExecuteAsync(sql, parameters);
            return rowsAffected > 0;
        }

        public async Task<bool> UpdateSettingsTimeToDeleteAsync(string email, int timeToDelete)
        {
            const string sql = @"
                UPDATE settings
                SET time_to_delete = @TimeToDelete
                WHERE user_email = @Email;";

            var parameters = new
            {
                Email = email,
                TimeToDelete = timeToDelete,
            };

            var rowsAffected = await db.ExecuteAsync(sql, parameters);
            return rowsAffected > 0;
        }
    }
}
