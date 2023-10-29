using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Services
{
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
                var limit = 30;

                // Set authorization header with access token
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", access_token);

                // Send a GET request to retrieve game data
                var response = await _httpClient.GetAsync($"games?fields=checksum,name,summary,genres,aggregated_rating,videos,cover,game_modes&limit={limit}");

                // Introduce a 1-second delay between requests
                await Task.Delay(250);

                // Ensure the response is successful
                response.EnsureSuccessStatusCode();

                // Read and parse the response data into an array of GameData objects
                var responseData = await response.Content.ReadFromJsonAsync<GameData[]>();

                // Filter out games with any null fields
                var filteredData = responseData
                    .Where(game => 
                        game.name != null && 
                        game.summary != null
                    )
                    .ToArray();

                // Define random genre and difficulty lists
                string[] _genreRandoList = { "All", "RPG", "MOBA", "Battle", "Racing", "Fighting"};
                string[] _diffRandoList = {"Entry", "Easy", "Medium", "Challenging"};

                // Process each game in the filtered data
                foreach (var game in filteredData)
                {
                    if (game.genres != null)
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

                    if (game.discount == 0)
                    {
                        game.discount = new Random().NextDouble();
                    }

                    if (game.price == 0)
                    {
                        game.price = new Random().NextDouble() * 60;
                    }

                    game.aggregated_rating = new Random().Next(1, 6);

                    if (string.IsNullOrEmpty(game.genre))
                    {
                        game.genre = _genreRandoList[new Random().Next(0, _genreRandoList.Length)];
                    }

                    if (string.IsNullOrEmpty(game.difficulty))
                    {
                        game.difficulty = _diffRandoList[new Random().Next(0, _diffRandoList.Length)];
                    }

                    System.Diagnostics.Debug.WriteLine(game.discount);
                }

                // Return the filtered data as a JSON response with a 200 status code
                return new ObjectResult(filteredData)
                {
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                if (ex.Message == "Response status code does not indicate success: 429 (Too Many Requests).")
                {
                    // Handle 429 (Too Many Requests) error
                    return new ObjectResult($"An error occurred: {ex.Message}")
                    {
                        StatusCode = 429
                    };
                }
                
                // Handle other errors with a 500 status code
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
                await Task.Delay(250);

                // Send a GET request to retrieve data for a specific endpoint
                var response = await _httpClient.GetAsync($"{endpointName}?id={endpointId}&fields=name&limit={30}");
                response.EnsureSuccessStatusCode();

                // Read and parse the response data into a list of GameDataItem objects
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

            await Task.Delay(250);

            // Send a GET request to retrieve URL data for a specific endpoint
            var response = await _httpClient.GetAsync($"{endpointName}?id={endpointId}&fields=url&limit={30}");
            response.EnsureSuccessStatusCode();

            // Read and parse the response data into a list of GameDataItem objects
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
}
