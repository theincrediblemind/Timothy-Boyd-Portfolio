using Backend.Services;
using Backend.Interfaces;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;


var builder = WebApplication.CreateBuilder(args);
var clientId = "q5ils97how1qiz2pl3qholgk9rc8em";

builder.Services.AddControllers();

// Register the HttpClient and AuthenticationService
builder.Services.AddHttpClient<IAuthenticationService, AuthenticationService>(client =>
{
    client.BaseAddress = new Uri("https://id.twitch.tv/oauth2/");
});

builder.Services.AddHttpClient<IIGDBService, IGDBService>(client =>
{
    client.BaseAddress = new Uri("https://api.igdb.com/v4/");
    client.DefaultRequestHeaders.Add("Client-ID", clientId);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Add rate limiting configuration
        builder.Services.AddOptions();
        builder.Services.AddMemoryCache();
        builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
        builder.Services.Configure<IpRateLimitPolicies>(builder.Configuration.GetSection("IpRateLimitPolicies"));
        builder.Services.AddInMemoryRateLimiting();
        builder.Services.AddMvc();
        builder.Services.Configure<IpRateLimitOptions>(options =>
        {
            options.GeneralRules = new List<RateLimitRule>
            {
                new RateLimitRule
                {
                    Endpoint = "*", // Apply rate limit to this endpoint
                    Limit = 4, // Maximum 4 requests
                    Period = "4s" // per second
                }
            };
        });
        builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Configure rate limiting middleware
app.UseIpRateLimiting();

app.MapControllers();

app.UseCors("CorsPolicy");

app.Run();
