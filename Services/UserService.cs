using Do2.DTOs;
using Do2.Services;
using Do2.Models.UserCredentials;
using UserModel = Do2.Models.User;

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

        var user = new UserModel()
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
            logger.LogInformation("Attempted user creation failed");
            return false;
        }

        return true;
    }
    
    public async Task<bool> DeleteUser(string email)
    {
        var isSuccessful = await repositoryService.DeleteUser(email);

        if (!isSuccessful)
        {
            logger.LogInformation("Attempted user deleted failed!");
            return false;
        }

        return true;
    }

    public async Task<UserInformationResponse> GetUser(string email)
    {
        return await repositoryService.GetUser(email);
    }

    Task<bool> IUserService.UpdateSettings()
    {
        throw new NotImplementedException();
    }

    public async Task<bool> UpdateEmail(UpdateEmailRequest request)
    {
        // Verify password
        var saltObj = await repositoryService.GetUserSalt(request.CurrentEmail);
        var computedHash = authenticationService.CreateUserHash(request.CurrentEmail, request.Password, saltObj.Salt);
        bool passwordValid = await repositoryService.CheckUserHash(new UserLoginCredentials
        {
            Email = request.CurrentEmail,
            Hash = computedHash
        });
        if (!passwordValid)
        {
            return false;
        }

        // Regenerate hash with new email (since email is used in hash generation)
        byte[] newHash = authenticationService.CreateUserHash(request.NewEmail, request.Password, saltObj.Salt);
        
        // Update email and password hash
        var isSuccessful = await repositoryService.UpdateUserEmailAndHash(request.CurrentEmail, request.NewEmail, newHash);
        return isSuccessful;
    }

    public async Task<bool> ChangePassword(ChangePasswordRequest request)
    {
        // Verify current password
        var saltObj = await repositoryService.GetUserSalt(request.Email);
        var computedHash = authenticationService.CreateUserHash(request.Email, request.CurrentPassword, saltObj.Salt);
        bool passwordValid = await repositoryService.CheckUserHash(new UserLoginCredentials
        {
            Email = request.Email,
            Hash = computedHash
        });
        if (!passwordValid)
        {
            return false;
        }

        // Update password
        byte[] newSalt = authenticationService.CreateUserSalt();
        byte[] newHash = authenticationService.CreateUserHash(request.Email, request.NewPassword, newSalt);
        var isSuccessful = await repositoryService.UpdateUserPassword(request.Email, newHash, newSalt);
        return isSuccessful;
    }
}
