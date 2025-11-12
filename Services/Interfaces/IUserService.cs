using Do2.DTOs;

namespace Do2.Services;

public interface IUserService
{
    Task<bool> CreateUser(BasicUserInformation basicUserInformation);

    Task<bool> DeleteUser(string email);

    Task<bool> UpdateSettings();
}
