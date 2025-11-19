using System.Security.Cryptography;
using System.Text;
using Do2.Interfaces;
using Do2.Models.UserCredentials;
using Konscious.Security.Cryptography;
using Microsoft.Extensions.Logging;

namespace Do2.Services;
public class AuthenticationService(ILogger _logger, IUserRepositoryService _userRepositoryService, RandomNumberGenerator _random) : IAuthenticationService
{
    const int PASSWORD_BYTE_COUNT = 128;
    const int SALT_BYTE_COUNT = 32;
    const int PARALLELISM_COUNT = 4;
    const int MEMORY_SIZE = 8192;
    const int ITERATION_COUNT = 40;
    private ILogger logger = _logger;
    private IUserRepositoryService userRepositoryService = _userRepositoryService;
    private RandomNumberGenerator random = _random;

    public async Task<bool> CheckUserHash(string email, string password)
    {
        byte[] salt;
        try
        {
            // Retrieve salt from db
            salt = (await userRepositoryService.GetUserSalt(email)).Salt;
        }
        catch (Exception ex)
        {
            logger.LogWarning($"Failed to retrieve salt for {email}: {ex.Message}");
            return false;
        }

        // Attempt to find user with username password hash combination
        // If found, authenticate, otherwise, fail
        bool isValid = await userRepositoryService.CheckUserHash(new UserLoginCredentials()
        {
            Email = email,
            Hash = CreateUserHash(email, password, salt)
        });

        // Because the algorithm's time can be measured, must delay a random amount of time
        await Task.Delay(RandomNumberGenerator.GetInt32(100)); 

        logger.LogInformation(email + " login attempt " + (isValid ? "successful" : "failed"));

        return isValid;
    }

    public byte[] CreateUserHash(string email, string password, byte[] salt)
    {
        // Prepare byte array
        byte[] PasswordBytes = encodeString(password);
        byte[] UserBytes = encodeString(email);

        // Create password hash

        // I am creating a new instance of Argon2i because the salt is apart of the constructor,
        // and the salt is determined on a user-by-user basis
        var passwordEncryptionInstance = new Argon2i(PasswordBytes)
        {
            DegreeOfParallelism = PARALLELISM_COUNT,
            MemorySize = MEMORY_SIZE,
            Iterations = ITERATION_COUNT,
            Salt = salt,
            AssociatedData = UserBytes
        };

        return passwordEncryptionInstance.GetBytes(PASSWORD_BYTE_COUNT);
    }

    public byte[] CreateUserSalt()
    {
        byte[] result = new byte[SALT_BYTE_COUNT];

        random.GetNonZeroBytes(result);

        return result;
    }

    private Func<string, byte[]> encodeString = Encoding.ASCII.GetBytes;
}
