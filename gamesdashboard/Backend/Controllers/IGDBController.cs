using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Interfaces;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IGDBController : ControllerBase
{
    private readonly IIGDBService _igdbService;
    private readonly IAuthenticationService _authenticationService;

    private readonly IConfiguration _configuration;
    
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
            var accessToken = await _authenticationService.GetAccessToken(_configuration["IGDB:ClientId"], _configuration["IGDB:ClientSecret"]);
            var gameData = await _igdbService.GetGameData(accessToken, _configuration["IGDB:ClientId"]);
            return Ok(gameData);
        }

        catch (Exception ex)
        {
            return StatusCode(500, $"An error occured: {ex.Message}");
        }
    }
}
