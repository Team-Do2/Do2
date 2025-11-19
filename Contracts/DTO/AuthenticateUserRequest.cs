namespace Do2.DTOs;

public class AuthenticateUserRequest
{
    public required string Email {get; set;}
    public required string Password {get; set;}
}
