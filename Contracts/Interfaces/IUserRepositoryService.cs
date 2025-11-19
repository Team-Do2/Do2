using Do2.DTOs;
using Do2.Models;
using Do2.Models.UserCredentials;

namespace Do2.Interfaces;

public interface IUserRepositoryService
{
    Task<UserSalt> GetUserSalt(string email);

    Task<bool> CheckUserHash(UserLoginCredentials generatedUserHash);

    Task<bool> CreateUser(User user);

    Task<bool> DeleteUser(string email);

    Task<UserInformationResponse> GetUser(string email);

    Task<bool> UpdateUserEmail(string currentEmail, string newEmail);

    Task<bool> UpdateUserEmailAndHash(string currentEmail, string newEmail, byte[] newHash);

    Task<bool> UpdateUserPassword(string email, byte[] hash, byte[] salt);
}
