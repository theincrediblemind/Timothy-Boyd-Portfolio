using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Interfaces;
using AspNetCoreRateLimit;
using Microsoft.Extensions.Options;



namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IGDBController : ControllerBase
{
    private readonly IIGDBService _igdbService;
    private readonly IAuthenticationService _authenticationService;

    private readonly IConfiguration _configuration;
    private static bool _dataFetched = false;

    
    public IGDBController(IIGDBService iGDBService, IAuthenticationService authenticationService, IConfiguration configuration)
    {
        _igdbService = iGDBService;
        _authenticationService = authenticationService;
        _configuration = configuration;
    }


    [HttpGet("getGameData")]
    public async Task<IActionResult> GetGameData()
    {
        try
        {
            if (!_dataFetched)
            {
                var accessToken = await _authenticationService.GetAccessToken(_configuration["IGDB:ClientId"], _configuration["IGDB:ClientSecret"]);
                var gameData = await _igdbService.GetGameData(accessToken, _configuration["IGDB:ClientId"]);
                var res = gameData as OkObjectResult;
                _dataFetched = true; // Set the flag to true after successful data fetch
                return Ok(gameData);
            }
            else
            {
                // Data has already been fetched; return a response indicating that
                return Ok("Data already fetched");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
}
}
