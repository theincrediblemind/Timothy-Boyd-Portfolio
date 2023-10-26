using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Text;
using Backend.Models;
using Backend.Interfaces;
public class AuthenticationService : IAuthenticationService
{
    private readonly HttpClient _httpClient;

    public AuthenticationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }


    public async Task<string> GetAccessToken(string clientId, string clientSecret)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"token?client_id={clientId}&client_secret={clientSecret}&grant_type=client_credentials");

        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        System.Diagnostics.Debug.WriteLine(response.Content);

        using var responseStream = await response.Content.ReadAsStreamAsync();
        var authResult = await JsonSerializer.DeserializeAsync<AuthResult>(responseStream);
        _httpClient.DefaultRequestHeaders.Add("Client-ID", clientId);
        _httpClient.DefaultRequestHeaders.Add("Bearer", authResult.access_token);

        return authResult.access_token;
    }
}

