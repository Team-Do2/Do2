namespace Do2.Contracts.Services;

public interface IAuthenticationService
{
    public Task<bool> CheckUserHash(string username, string password);
}
