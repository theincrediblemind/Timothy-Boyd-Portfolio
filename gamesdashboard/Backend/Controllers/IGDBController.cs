using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IGDBController : ControllerBase
{
    private readonly IGDBService _igdbService;
    
    public IGDBController(IGDBService iGDBService)
    {
        _igdbService = iGDBService;
    }

    [HttpGet("getGameData")]
    public async Task<IActionResult> GetGameData()
    {
        try
        {
            var gameData = await _igdbService.GetGameDataAsync();
            return Ok(gameData);
        }

        catch (Exception ex)
        {
            return StatusCode(500, $"An error occured: {ex.Message}");
        }
    }
}
