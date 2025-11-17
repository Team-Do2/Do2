using UserModel = Do2.Models.User;
using Do2.Models.UserCredentials;

namespace Do2.Services;

public interface IUserRepositoryService
{
    Task<UserSalt> GetUserSalt(string email);

    Task<bool> CheckUserHash(UserLoginCredentials generatedUserHash);

    Task<bool> CreateUser(UserModel user);

    Task<bool> DeleteUser(string email);

    Task<UserModel> GetUser(string email);
}
