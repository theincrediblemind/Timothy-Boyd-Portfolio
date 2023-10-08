using System;
using System.Net.Http;
using System.Threading.Tasks;
using Backend.Controllers;
namespace Backend.Services;

public class IGDBService
{
    private readonly HttpClient _httpClient;

    
    public IGDBService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("IGDBApi");
    }

    public async Task<string> GetGameDataAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("games");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        
        catch (Exception ex)
        {
        
            return ex.Message;
        }
    }
}
