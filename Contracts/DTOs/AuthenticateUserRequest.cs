using System;

namespace Do2.Contracts.DTOs;

public class AuthenticateUserRequest
{
    public required string Email {get; set;}
    public required string Password {get; set;}
}
