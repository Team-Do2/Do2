namespace Do2.Contracts.DatabaseModels.UserCredentials;

public class UserSalt
{
    required public byte[] Salt { get; set; }
}

public class UserLoginCredentials
{
    required public string Email { get; set; }
    required public byte[] Hash { get; set; }
}