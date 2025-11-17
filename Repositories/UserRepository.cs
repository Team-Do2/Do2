using System.Data;
using Dapper;
using Do2.Models;
using Do2.Models.UserCredentials;
using Do2.Services;
using Do2.DTOs;
using MySqlX.XDevAPI.Common;
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

    public async Task<UserInformationResponse> GetUser(string email)
    {
        string sql = @"
        SELECT email, first_name AS firstName, last_name AS lastName FROM user 
        WHERE email = @Email";

        var result = await db.QueryFirstOrDefaultAsync<UserInformationResponse>(sql, new { Email = email });

        if (result == null) {
            const string LoggedError = "Failed to retrieve user from email!";
            logger.LogError(LoggedError);
            throw new Exception(LoggedError);
        }

        return result;
    }

    public async Task<bool> UpdateUserEmail(string currentEmail, string newEmail)
    {
        db.Open();
        using var transaction = db.BeginTransaction();
        try
        {
            // Check if new email already exists
            string checkEmailSql = "SELECT COUNT(*) FROM user WHERE email = @NewEmail";
            int existingCount = await db.ExecuteScalarAsync<int>(checkEmailSql, new { NewEmail = newEmail }, transaction);
            if (existingCount > 0)
            {
                transaction.Rollback();
                logger.LogWarning("Attempted to update email to {NewEmail} which already exists", newEmail);
                return false;
            }

            // Update user (cascade will update foreign keys)
            string updateUserSql = @"
            UPDATE user 
            SET email = @NewEmail
            WHERE email = @CurrentEmail";
            int rowsAffected = await db.ExecuteAsync(updateUserSql, new { CurrentEmail = currentEmail, NewEmail = newEmail }, transaction);

            if (rowsAffected > 0)
            {
                transaction.Commit();
                string LogSuccess = "Updated email from " + currentEmail + " to " + newEmail;
                logger.LogInformation(LogSuccess);
                return true;
            }
            else
            {
                transaction.Rollback();
                string LoggedError = "Failed to update email from " + currentEmail + " to " + newEmail;
                logger.LogInformation(LoggedError);
                return false;
            }
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            logger.LogError(ex, "Error updating email from {CurrentEmail} to {NewEmail}", currentEmail, newEmail);
            return false;
        }
        finally
        {
            db.Close();
        }
    }

    public async Task<bool> UpdateUserEmailAndHash(string currentEmail, string newEmail, byte[] newHash)
    {
        db.Open();
        using var transaction = db.BeginTransaction();
        try
        {
            // Check if new email already exists
            string checkEmailSql = "SELECT COUNT(*) FROM user WHERE email = @NewEmail";
            int existingCount = await db.ExecuteScalarAsync<int>(checkEmailSql, new { NewEmail = newEmail }, transaction);
            if (existingCount > 0)
            {
                transaction.Rollback();
                logger.LogWarning("Attempted to update email to {NewEmail} which already exists", newEmail);
                return false;
            }

            // Update user email and hash (cascade will update foreign keys)
            string updateUserSql = @"
            UPDATE user 
            SET email = @NewEmail, password_hash = @NewHash
            WHERE email = @CurrentEmail";
            int rowsAffected = await db.ExecuteAsync(updateUserSql, new { CurrentEmail = currentEmail, NewEmail = newEmail, NewHash = newHash }, transaction);

            if (rowsAffected > 0)
            {
                transaction.Commit();
                string LogSuccess = "Updated email from " + currentEmail + " to " + newEmail + " with new hash";
                logger.LogInformation(LogSuccess);
                return true;
            }
            else
            {
                transaction.Rollback();
                string LoggedError = "Failed to update email from " + currentEmail + " to " + newEmail;
                logger.LogInformation(LoggedError);
                return false;
            }
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            logger.LogError(ex, "Error updating email from {CurrentEmail} to {NewEmail}", currentEmail, newEmail);
            return false;
        }
        finally
        {
            db.Close();
        }
    }

    public async Task<bool> UpdateUserPassword(string email, byte[] hash, byte[] salt)
    {
        string sql = @"
        UPDATE user 
        SET password_hash = @Hash, password_salt = @Salt
        WHERE email = @Email";

        int rowsAffected = await db.ExecuteAsync(sql, new { Email = email, Hash = hash, Salt = salt });

        bool isSuccessful = rowsAffected > 0;

        if (isSuccessful)
        {
            string LogSuccess = "Updated password for " + email;
            logger.LogInformation(LogSuccess);
            return isSuccessful;
        }
        else
        {
            string LoggedError = "Failed to update password for " + email;
            logger.LogInformation(LoggedError);
            return isSuccessful;
        }
    }
}
