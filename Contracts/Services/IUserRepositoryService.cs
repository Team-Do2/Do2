using Do2.Contracts.DatabaseModels;
using Do2.Contracts.DatabaseModels.UserCredentials;

namespace Do2.Contracts.Services;

public interface IUserRepositoryService
{
    Task<UserSalt> GetUserSalt(string email);

    Task<bool> CheckUserHash(UserLoginCredentials generatedUserHash);

    Task<bool> CreateUser(User user);

    Task<bool> DeleteUser(string email);
}
