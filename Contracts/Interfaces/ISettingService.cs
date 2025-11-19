namespace Do2.Interfaces;
public interface ISettingsService
{
    public Task<bool> UpdateTaskDeletionInterval(TimeSpan timeSpan);
    public Task<bool> UpdateTheme(Themes newTheme);
}