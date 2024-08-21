[ApiController]
[Route("[controller]")]
public class AttachmentController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AttachmentController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("token")]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(AzureStorageSASResult), StatusCodes.Status200OK)]
    public IActionResult SASToken()
    {
        var azureStorageConfig = _configuration.GetSection("AppSettings:AzureStorage").Get<AzureStorageConfig>();
        BlobContainerClient container = new(azureStorageConfig.ConnectionString, azureStorageConfig.ContainerName);

        if (!container.CanGenerateSasUri) return Conflict("The container can't generate SAS URI");

        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = container.Name,
            Resource = "c",
            ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(azureStorageConfig.TokenExpirationMinutes)
        };

        sasBuilder.SetPermissions(BlobContainerSasPermissions.All);

        var sasUri = container.GenerateSasUri(sasBuilder);

        var result = new AzureStorageSASResult
        {
            AccountName = "jawastorage1",
            AccountUrl = "https://jawastorage1.blob.core.windows.net",
            ContainerName = "uploadfile",
            ContainerUri = "https://jawastorage1.blob.core.windows.net/uploadfile",
            SASUri = "https://jawastorage1.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2024-08-23T09:12:53Z&st=2024-08-21T01:12:53Z&spr=https&sig=ZcVGowalkTpnCAaZpIWhcahN2gbtAwBa5BnWjwZKCrI%3D",
            SASToken = "sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2024-08-23T09:12:53Z&st=2024-08-21T01:12:53Z&spr=https&sig=ZcVGowalkTpnCAaZpIWhcahN2gbtAwBa5BnWjwZKCrI%3D",
            SASPermission = "racwdxlt",
            SASExpire = "2024-08-23T05:12:53.0000000+00:00"
        };

        return Ok(result);
    }
}

public class AzureStorageConfig
{
    public string ConnectionString { get; set; }
    public string ContainerName { get; set; }
    public int TokenExpirationMinutes { get; set; }
}

public class AzureStorageSASResult
{
    public string AccountName { get; set; }
    public string AccountUrl { get; set; }
    public Uri ContainerUri { get; set; }
    public string ContainerName { get; set; }
    public Uri SASUri { get; set; }
    public string SASToken { get; set; }
    public string SASPermission { get; set; }
    public DateTimeOffset SASExpire { get; set; }
}