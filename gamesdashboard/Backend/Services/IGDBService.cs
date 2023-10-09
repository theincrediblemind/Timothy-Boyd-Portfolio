using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using Backend.Interfaces;
using Backend.Models;
namespace Backend.Services;

public class IGDBService : IIGDBService
{
    private readonly HttpClient _httpClient;

    
    public IGDBService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GetGameData(string access_token, string cl)
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
            var response = await _httpClient.GetAsync("games?fields=name,summary,genres,aggregated_rating,videos,cover");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        
        catch (Exception ex)
        {
        
            return ex.Message;
        }
    }
}
