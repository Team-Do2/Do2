using Do2.DTOs;
using UserModel = Do2.Models.User;

namespace Do2.Services;

public interface IUserService
{
    Task<bool> CreateUser(BasicUserInformation basicUserInformation);

    Task<bool> DeleteUser(string email);

    Task<UserInformationResponse> GetUser(string email);

    Task<bool> UpdateSettings();

    Task<bool> UpdateEmail(UpdateEmailRequest request);

    Task<bool> ChangePassword(ChangePasswordRequest request);
}
