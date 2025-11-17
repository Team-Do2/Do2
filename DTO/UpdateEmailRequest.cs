namespace Do2.DTOs;

public class UpdateEmailRequest
{
    public string CurrentEmail { get; set; } = string.Empty;
    public string NewEmail { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}