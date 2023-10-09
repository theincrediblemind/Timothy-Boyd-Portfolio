using Backend.Services;
using Backend.Interfaces;

var builder = WebApplication.CreateBuilder(args);
var clientId = "q5ils97how1qiz2pl3qholgk9rc8em";

builder.Services.AddControllers();

// Register the HttpClient and AuthenticationService
builder.Services.AddHttpClient<IAuthenticationService, AuthenticationService>( client =>
{
    client.BaseAddress = new Uri("https://id.twitch.tv/oauth2/");
    

});

builder.Services.AddHttpClient<IIGDBService, IGDBService>( client =>
{
    client.BaseAddress = new Uri("https://api.igdb.com/v4/");
    client.DefaultRequestHeaders.Add("Client-ID", clientId);


});



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

app.MapControllers();

app.Run();