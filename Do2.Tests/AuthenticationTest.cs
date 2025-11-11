using System.Threading.Tasks;
using Autofac;
using Do2.Contracts.Services;
using Xunit;

namespace Do2.Tests;
public class AuthenticationTest  : IClassFixture<AutofacFixture>
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
            await userService.CreateUser(new Contracts.DTOs.BasicUserInformation()
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
}
