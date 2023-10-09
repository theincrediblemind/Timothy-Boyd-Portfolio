using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
namespace Backend.Services;

public class IGDBService : IIGDBService
{
    private readonly HttpClient _httpClient;

    
    public IGDBService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

public async Task<IActionResult> GetGameData(string access_token, string cl)
{
    try
    {
        var limit = 100;
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", access_token);
        var response = await _httpClient.GetAsync($"games?fields=checksum,name,summary,genres,aggregated_rating,videos,cover,game_modes&limit={limit}");
        response.EnsureSuccessStatusCode();
        var responseData = await response.Content.ReadFromJsonAsync<GameData[]>();

        // Filter out games with any null fields
        var filteredData = responseData
            .Where(game => 
                game.name != null && 
                game.summary != null
            )
            .ToArray();

        foreach (var game in filteredData)
        {
            if (game.genres != null )
            {
                game.genreNames = await GetEndpointList(game.genres, "genres");
            }

            if (game.videos != null)
            {
                game.videoUrls = await GetEndpointList(game.videos, "game_videos");
            }
            if (game.cover != 0)
            {
                game.coverUrl = await GetEndpointUrl(game.cover, "covers");
            }
        }

        return new ObjectResult(filteredData)
        {
            StatusCode = 200
        };
    }
    
    catch (Exception ex)
    {
        return new ObjectResult($"An error occurred: {ex.Message}")
        {
            StatusCode = 500
        };
    }
}

private async Task<List<string>> GetEndpointList(int[] endpointIds, string endpointName)
{
    var endpointItems = new List<string>();

    foreach (var endpointId in endpointIds)
    {
        var response = await _httpClient.GetAsync($"{endpointName}?id={endpointId}&fields=name");
        response.EnsureSuccessStatusCode();
        var endpointData = await response.Content.ReadFromJsonAsync<List<GameDataItem>>();

        if (endpointData != null)
        {
            var data = endpointData.FirstOrDefault(ep => ep.id == endpointId);
            
            if (data != null)
            {
                endpointItems.Add(data.name);
            }
        }
    }

    return endpointItems;
}

private async Task<string> GetEndpointUrl(int endpointId, string endpointName)
{
    var endpointUrl = "";


    var response = await _httpClient.GetAsync($"{endpointName}?id={endpointId}&fields=url");
    response.EnsureSuccessStatusCode();
    var endpointData = await response.Content.ReadFromJsonAsync<List<GameDataItem>>();

    if (endpointData != null)
    {
        var data = endpointData.FirstOrDefault(ep => ep.id == endpointId);
        
        if (data != null)
        {
            endpointUrl = data.name;
        }
    }

    return endpointUrl;
}

}
