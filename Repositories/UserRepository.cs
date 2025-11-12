using System.Data;
using Dapper;
using Do2.Models;
using Do2.Models.UserCredentials;
using Do2.Services;
namespace Do2.Repositories;

public class UserRepositoryService(IDbConnection _db, ILogger _logger) : IUserRepositoryService
{
    private readonly IDbConnection db = _db;
    private readonly ILogger logger = _logger;

    public async Task<bool> CheckUserHash(UserLoginCredentials userLoginCredentials)
    {
        
        string sql = @"
        SELECT EXISTS (
            SELECT 
                1 FROM user 
            WHERE 
                email = @Email AND password_hash = @Hash
        )";

        return await db.QueryFirstOrDefaultAsync<bool>(sql, userLoginCredentials);
    }

    public async Task<bool> CreateUser(User user)
    {
        string sql = @"
        INSERT INTO user 
            (email, password_hash, password_salt, first_name, last_name) 
        VALUES 
            (@Email, @Hash, @Salt, @FirstName, @LastName)";

        int rowsAffected = await db.ExecuteAsync(sql, user);

        bool isSuccessful = rowsAffected > 0;

        if (isSuccessful)
        {
            string LogSuccess = "Created user with " + user.Email;
            logger.LogInformation(LogSuccess);
            return isSuccessful;
        }
        else
        {
            string LoggedError = "Failed to create user with " + user.Email;
            logger.LogInformation(LoggedError);
            return isSuccessful;
        }
    }

    public async Task<bool> DeleteUser(string email)
    {
        string sql = @"
        DELETE FROM user 
        WHERE email = @Email";

        int rowsAffected = await db.ExecuteAsync(sql, new {Email=email});

        bool isSuccessful = rowsAffected > 0;

        if (isSuccessful)
        {
            string LogSuccess = "Deleted user with " + email;
            logger.LogInformation(LogSuccess);
            return isSuccessful;
        }
        else
        {
            string LoggedError = "Failed to delete user with " + email;
            logger.LogInformation(LoggedError);
            return isSuccessful;
        }
    }

    public async Task<UserSalt> GetUserSalt(string email)
    {
        string sql = @"
        SELECT password_salt FROM user 
        WHERE email = @Email";

        var saltString = await db.QueryFirstOrDefaultAsync<byte[]>(sql, new { Email = email });

        if (saltString == null) {
            const string LoggedError = "Failed to retrieve user salt from email!";
            logger.LogError(LoggedError);
            throw new Exception(LoggedError);
        }

        return new UserSalt()
        {
            Salt = saltString
        };
    }
}
