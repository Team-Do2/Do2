namespace Do2.Services;

public interface IAuthenticationService
{
    public Task<bool> CheckUserHash(string email, string password);

    public byte[] CreateUserHash(string email, string password, byte[] salt);

    public byte[] CreateUserSalt();
}
