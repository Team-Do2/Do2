using System;

namespace Do2.Contracts.DatabaseModels;

public class User
{
    public required string Email;
    public required string FirstName;
    public required string LastName;
    public required byte[] Salt;
    public required byte[] Hash;
}

public class UserSettings
{
    public ColorThemes ColorThemes { get; set; }
    public TimeSpan TimeToDelete {get; set;}
}


public enum ColorThemes
{
    Dark,
    Light
}