using Backend.Services;

var builder = WebApplication.CreateBuilder(args);
var clientID = "q5ils97how1qiz2pl3qholgk9rc8em";
var clientSecret = "jlhcqal8gs7wdattpqdfwynvda951v";



builder.Services.AddHttpClient("IGDBApi", client =>
{
    client.BaseAddress = new Uri("https://api.igdb.com/v4/"); // IGDB API base URL
    client.DefaultRequestHeaders.Add("Client-ID", clientID);
    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {clientSecret}");
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IGDBService>();



var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
