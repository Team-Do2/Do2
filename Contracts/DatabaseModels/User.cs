using System;

namespace Do2.Contracts.DatabaseModels;

public class User
{
    public required string Email { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required byte[] Salt { get; set; }
    public required byte[] Hash { get; set; }
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