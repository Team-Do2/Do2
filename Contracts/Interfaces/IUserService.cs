using Do2.DTOs;

namespace Do2.Interfaces;

public interface IUserService
{
    Task<bool> CreateUser(BasicUserInformation basicUserInformation);

    Task<bool> DeleteUser(string email);

    Task<UserInformationResponse> GetUser(string email);

    Task<bool> UpdateSettings();

    Task<bool> UpdateEmail(UpdateEmailRequest request);

    Task<bool> ChangePassword(ChangePasswordRequest request);
}
