namespace Do2.Services;

public interface ISessionService
{
    static short COOKIE_SIZE;

    // Doesn't have to be these parameters
    // Assumes user is already authenticated
    public string CreateSession(string email, TimeSpan duration);

    public bool ValidateSession(string accessToken);

    public void InvalidateSessionByAccessToken(string accessToken);
    public void InvalidateSessionByEmail(string email);
}
