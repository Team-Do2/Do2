using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using Do2.Contracts.DatabaseModels.UserCredentials;
using Do2.Contracts.Services;
using Konscious.Security.Cryptography;

namespace Do2.Services;

public class AuthenticationService(ILogger _logger, IUserRepositoryService _userRepositoryService, Random _random) : IAuthenticationService
{
    const int BYTE_COUNT = 128;
    const int PARALLELISM_COUNT = 4;
    const int MEMORY_SIZE = 8192;
    private ILogger logger = _logger;
    private IUserRepositoryService userRepositoryService = _userRepositoryService;
    private Random random = _random;

    public async Task<bool> CheckUserHash(string email, string password)
    {
        // Retrieve salt from db
        byte[] salt = (await userRepositoryService.GetUserSalt(email)).Salt;

        // Attempt to find user with username password hash combination
        // If found, authenticate, otherwise, fail
        bool isValid = await userRepositoryService.CheckUserHash(new UserLoginCredentials()
        {
            Email = email,
            Hash = CreateUserHash(email, password, salt)
        });

        // Because the algorithm's time can be measured, must delay a random amount of time
        await Task.Delay(random.Next(0, 100));

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
            Salt = salt,
            AssociatedData = UserBytes
        };

        return passwordEncryptionInstance.GetBytes(BYTE_COUNT);
    }

    public byte[] CreateUserSalt()
    {
        byte[] result = new byte[BYTE_COUNT];

        random.NextBytes(result);

        return result;
    }

    private Func<string, byte[]> encodeString = Encoding.ASCII.GetBytes;
}
