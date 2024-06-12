namespace OurAnimeList.Helpers;

[Serializable]
public class MissingRequiredUserSecret : Exception
{
    public MissingRequiredUserSecret ()
    {}

    public MissingRequiredUserSecret (string message) 
        : base(message)
    {}

    public MissingRequiredUserSecret (string message, Exception innerException)
        : base (message, innerException)
    {}    
}

public class UserSecretsValidation
{
    private readonly List<string> _userSecrets =
    [
        "MyAnimeList:ClientId",
        "Jwt:Issuer",
        "Jwt:Audience",
        "Jwt:Key"
    ];
    
    public void Validate(IConfigurationRoot config)
    {
        foreach (string userSecret in _userSecrets.Where(userSecret => config[userSecret] == null))
        {
            throw new MissingRequiredUserSecret($"Missing \"{userSecret}\" User Secret.");
        }
    }
}