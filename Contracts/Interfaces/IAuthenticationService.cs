namespace Do2.Interfaces;

public interface IAuthenticationService
{
    public Task<bool> CheckUserHash(string email, string password);

    public byte[] CreateUserHash(string email, string password, byte[] salt);

    public byte[] CreateUserSalt();
}
