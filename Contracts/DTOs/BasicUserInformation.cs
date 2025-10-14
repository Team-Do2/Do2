using System;

namespace Do2.Contracts.DTOs;

public class BasicUserInformation
{
    public required string Email  {get; set;}
    public required string FirstName  {get; set;}
    public required string LastName  {get; set;}
    public required string Password  {get; set;}
}
