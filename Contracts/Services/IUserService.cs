using System;
using Do2.Contracts.DatabaseModels.UserCredentials;
using Do2.Contracts.DTOs;

namespace Do2.Contracts.Services;

public interface IUserService
{
    Task<bool> CreateUser(BasicUserInformation basicUserInformation);

    bool DeleteUser(UserLoginCredentials userLoginCredentials);

    Task<bool> UpdateSettings();
}
