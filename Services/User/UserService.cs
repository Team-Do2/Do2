using System.Diagnostics;
using System.Threading.Tasks;
using Do2.Contracts.DatabaseModels.UserCredentials;
using Do2.Contracts.DTOs;
using Do2.Contracts.Services;

namespace Do2.Services.User;

public class UserService(IAuthenticationService _authenticationService, IUserRepositoryService _repositoryService, ILogger _logger) : IUserService
{
    IAuthenticationService authenticationService = _authenticationService;
    IUserRepositoryService repositoryService = _repositoryService;
    ILogger logger = _logger;

    public async Task<bool> CreateUser(BasicUserInformation basicUserInformation)
    {
        byte[] salt = authenticationService.CreateUserSalt();
        byte[] hash = authenticationService.CreateUserHash(basicUserInformation.Email, basicUserInformation.Password, salt); //basicUserInformation.Password

        var user = new Contracts.DatabaseModels.User()
        {
            Email = basicUserInformation.Email,
            FirstName = basicUserInformation.FirstName,
            LastName = basicUserInformation.LastName,
            Hash = hash,
            Salt = salt,
        };

        var isSuccessful = await repositoryService.CreateUser(user);

        if (!isSuccessful)
        {
            _logger.LogInformation("Attempted user creation failed");
            return false;
        }

        return true;
    }
    
    public bool DeleteUser(UserLoginCredentials userLoginCredentials)
    {
        throw new NotImplementedException();
    }

    Task<bool> IUserService.UpdateSettings()
    {
        throw new NotImplementedException();
    }
}
