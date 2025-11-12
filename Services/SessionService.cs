using System.Collections.Concurrent;
using System.Security.Cryptography;
using Do2.Services;

namespace Do2.Services.Authentication;

public class SessionService(RandomNumberGenerator _random, ILogger _logger) : ISessionService
{
    static short COOKIE_SIZE = 32;

    RandomNumberGenerator random = _random;
    ILogger logger = _logger;
    private ConcurrentDictionary<string, string> AccessTokenToEmailTable = new ConcurrentDictionary<string, string>();
    private ConcurrentDictionary<string, DateTime> AccessTokenToExpirationTable = new ConcurrentDictionary<string, DateTime>();
    private ConcurrentDictionary<string, string> EmailToAccessTokenTable = new ConcurrentDictionary<string, string>();
    public string CreateSession(string email, TimeSpan duration)
    {
        if (EmailToAccessTokenTable.ContainsKey(email))
        {
            InvalidateSessionByEmail(email);
            const string message = "Invalided session because of suspected multi-session login!";
            throw new Exception(message);
        }

        byte[] accessToken = new byte[COOKIE_SIZE]; // Change to secure
        random.GetNonZeroBytes(accessToken);

        string accessTokenString = Convert.ToBase64String(accessToken);

        AddToTable(email, accessTokenString, DateTime.UtcNow + duration);

        return accessTokenString;
    }

    public void InvalidateSessionByAccessToken(string accessToken)
    {
        string email = AccessTokenToEmailTable[accessToken];
        InvalidateSession(email, accessToken);
    }

    public void InvalidateSessionByEmail(string email)
    {
        string accessToken = EmailToAccessTokenTable[email];
        InvalidateSession(email, accessToken);
    }

    void InvalidateSession(string email, string accessToken)
    {
        logger.LogCritical("Invalided session for " + email);

        EmailToAccessTokenTable.Remove(email, out _);
        AccessTokenToEmailTable.Remove(accessToken, out _);
        AccessTokenToExpirationTable.Remove(accessToken, out _);
    }

    void AddToTable(string email, string accessToken, DateTime expirationDate)
    {
        bool emailAdded = EmailToAccessTokenTable.TryAdd(email, accessToken);
        bool tokenEmailAdded = AccessTokenToEmailTable.TryAdd(accessToken, email);
        bool tokenExpirationAdded = AccessTokenToExpirationTable.TryAdd(accessToken, expirationDate);
        
        // CRITICAL CHECK: If any Add failed after the initial check in CreateSession,
        // it indicates a rare race condition. You must clean up the partial adds.
        if (!emailAdded || !tokenEmailAdded || !tokenExpirationAdded)
        {
            // Clean up any successfully added parts of the transaction
            EmailToAccessTokenTable.TryRemove(email, out _);
            AccessTokenToEmailTable.TryRemove(accessToken, out _);
            AccessTokenToExpirationTable.TryRemove(accessToken, out _);

            const string message = "Failed to create session due to a concurrent write conflict.";
            // Log and throw an exception to indicate the session creation failed due to concurrency.
            logger.LogError(message);
            throw new InvalidOperationException(message);
        }
    }

    public bool ValidateSession(string accessToken)
    {
        bool hasKey = AccessTokenToExpirationTable.TryGetValue(accessToken, out DateTime expirationDate);

        if (!hasKey) return false;

        if (DateTime.UtcNow >= expirationDate)
        {
            InvalidateSessionByAccessToken(accessToken);
            return false;
        }

        return true;
    }
}