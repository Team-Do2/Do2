using System.Data;
using Dapper;
using Do2.Contracts.DatabaseModels.UserCredentials;
using Do2.Contracts.Services;
using Microsoft.AspNetCore.SignalR;
using Mysqlx;

namespace Do2.Repositories;

public class UserRepositoryService(IDbConnection _db, ILogger _logger) : IUserRepositoryService
{
    private readonly IDbConnection db = _db;
    private readonly ILogger logger = _logger;

    public async Task<bool> CheckUserHash(UserLoginCredentials userLoginCredentials)
    {
        return db.QueryFirstOrDefaultAsync<bool>
        ($"SELECT EXISTS (SELECT 1 FROM user WHERE {userLoginCredentials.Email} AND {userLoginCredentials.Hash})").Result;
    }

    public async Task<UserSalt> GetUserSalt(string email)
    {
        string query = $"SELECT 1 FROM user WHERE {email}";

        var result = await db.QueryFirstOrDefaultAsync<byte[]>(query);

        if (result == null) {
            const string LoggedError = "Failed to retrieve user salt from email!";
            logger.LogError(LoggedError);
            throw new Exception(LoggedError);
        }

        return new UserSalt()
        {
            Salt = result
        };
    }
}
