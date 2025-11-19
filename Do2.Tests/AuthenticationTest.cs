using System.Text;
using System.Text.Json;
using Autofac;
using Do2.DTOs;
using Do2.Models;
using Task = System.Threading.Tasks.Task;
using Do2.Interfaces;

namespace Do2.Tests;

public class AuthenticationTest : IClassFixture<AutofacFixture>
{
    IAuthenticationService authenticationService;
    IUserService userService;
    public AuthenticationTest(AutofacFixture fixture)
    {
        // Resolve the service from the container built in the fixture
        authenticationService = fixture.Container.Resolve<IAuthenticationService>();
        userService = fixture.Container.Resolve<IUserService>();
    }

    [Fact]
    public async Task CreateUserAuthenticationLifecycle()
    {
        string Email = "test";
        string Password = "test";
        string FirstName = "test";
        string LastName = "test";

        Assert.True(
            await userService.CreateUser(new BasicUserInformation()
            {
                Email = Email,
                Password = Password,
                FirstName = FirstName,
                LastName = LastName
            })
        );


        Assert.True(await authenticationService.CheckUserHash(Email, Password));

        Assert.True(await userService.DeleteUser(Email));
    }

    [Fact]
    public async Task CheckEndpointSecurity() // <---------------------- Isn't finished
    {
        string BaseUrl = "https://localhost:7134";
        string Email = "testsecurity@example.com"; // Use a unique email
        string Password = "testpassword";
        string FirstName = "Test";
        string LastName = "Security";
        string ProtectedEndpointUrl = $"{BaseUrl}/api/Task"; // Replace with the actual protected task endpoint

        var client = new HttpClient();

        // 1. Create User
        Assert.True(
            await userService.CreateUser(new BasicUserInformation()
            {
                Email = Email,
                Password = Password,
                FirstName = FirstName,
                LastName = LastName
            })
        );

        string authToken = null;

        try
        {
            // --- Authentication Step ---
            var authPayload = new AuthenticateUserRequest // Assuming this DTO exists
            {
                Email = Email,
                Password = Password
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(authPayload),
                Encoding.UTF8,
                "application/json"
            );

            // POST to the authentication endpoint
            var authResponse = await client.PostAsync(
                $"{BaseUrl}/api/Authentication/AuthenticateUser",
                jsonContent
            );

            // Assert successful authentication
            authResponse.EnsureSuccessStatusCode();

            // Extract the authentication token/cookie/body data
            // NOTE: This assumes the token is returned in the JSON body. 
            // If it's a cookie, the logic would need to change to read the 'Set-Cookie' header 
            // and use a HttpClientHandler with CookieContainer, or simply pass the cookie header.
            var responseBody = await authResponse.Content.ReadAsStringAsync();
            // Assuming the response body is a simple string containing the token:
            authToken = responseBody.Trim('"'); // Adjust based on the actual response format

            Assert.False(string.IsNullOrEmpty(authToken), "Authentication token should not be null or empty.");

            // --- Protected Endpoint Access Step ---
            // Create a dummy task object (assuming the endpoint expects a POST with data)
            var taskPayload = new TaskModel() // Assuming this DTO exists
            {
                name = "This is a secured test task.",
                userEmail = Email
            };

            var taskContent = new StringContent(
                JsonSerializer.Serialize(taskPayload),
                Encoding.UTF8,
                "application/json"
            );

            // Access the protected endpoint
            var protectedResponse = await client.PostAsync(
                ProtectedEndpointUrl,
                taskContent
            );

            // Check if access was successful (HTTP 200/201)
            Assert.True(protectedResponse.IsSuccessStatusCode, $"Access to protected endpoint failed: {protectedResponse.StatusCode}");

            // --- Optional: Check security failure (e.g., attempt without token) ---
            client.DefaultRequestHeaders.Authorization = null; // Remove token
            var unauthorizedResponse = await client.PostAsync(
                ProtectedEndpointUrl,
                taskContent
            );
            // Check that access fails without the token (HTTP 401 Unauthorized or 403 Forbidden)
            Assert.False(unauthorizedResponse.IsSuccessStatusCode, "Access should fail without authentication.");
            Assert.True(
                unauthorizedResponse.StatusCode == System.Net.HttpStatusCode.Unauthorized ||
                unauthorizedResponse.StatusCode == System.Net.HttpStatusCode.Forbidden,
                $"Expected 401/403, got {unauthorizedResponse.StatusCode}"
            );

        }
        finally
        {
            // 2. Delete User (Clean up)
            Assert.True(await userService.DeleteUser(Email), "User cleanup failed.");
        }


        // string Email = "test";
        // string Password = "test";
        // string FirstName = "test";
        // string LastName = "test";

        // Assert.True(
        //     await userService.CreateUser(new Contracts.DTOs.BasicUserInformation()
        //     {
        //         Email = Email,
        //         Password = Password,
        //         FirstName = FirstName,
        //         LastName = LastName
        //     })
        // );

        // /*
        // https://localhost:7134/api/Authentication/AuthenticateUser
        // {
        //     "Email":Email,
        //     "Password":Password
        // }

        // Take cookie

        // http://localhost:5015/api/Task
        // AuthToken : fzY8LGeniXbhgJWapPBBE6ZeHEuTQoy6Uq2CqSZlA3k=

        // Check if it works

        // */
        // Assert.True(await userService.DeleteUser(Email));

    }
}
