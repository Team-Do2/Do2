using UserModel = Do2.Models.User;
using Do2.Models.UserCredentials;
using Do2.DTOs;

namespace Do2.Services;

public interface IUserRepositoryService
{
    Task<UserSalt> GetUserSalt(string email);

    Task<bool> CheckUserHash(UserLoginCredentials generatedUserHash);

    Task<bool> CreateUser(UserModel user);

    Task<bool> DeleteUser(string email);

    Task<UserInformationResponse> GetUser(string email);
}
