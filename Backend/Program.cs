
//using IPLLive.API.Data;
//using IPLLive.API.Data.Repositories;
//using IPLLive.API.Hubs;
//using IPLLive.API.Services;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.Builder;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.Hosting;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.OpenApi.Models;
//using System.Text;
//using System.Threading.Tasks;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.
//builder.Services.AddControllers();

//// Configure DbContext
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//// Add SignalR for real-time updates
//builder.Services.AddSignalR();

//// Configure Repositories
//builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
//builder.Services.AddScoped<ITeamRepository, TeamRepository>();
//builder.Services.AddScoped<IMatchRepository, MatchRepository>();
//builder.Services.AddScoped<IBallByBallRepository, BallByBallRepository>();
//builder.Services.AddScoped<IPointTableRepository, PointTableRepository>();
//builder.Services.AddScoped<ISeasonRepository, SeasonRepository>();
//builder.Services.AddScoped<IUmpiresRepository, UmpiresRepository>();
//builder.Services.AddScoped<IUserRepository, UserRepository>();
//builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();

//// Configure Services
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IMatchService, MatchService>();
//builder.Services.AddScoped<IScoreService, ScoreService>();
//builder.Services.AddScoped<IPlayerService, PlayerService>();
//builder.Services.AddScoped<IBallByBallService, BallByBallService>();
//builder.Services.AddScoped<IPointTableService, PointTableService>();
//builder.Services.AddScoped<ISeasonService, SeasonService>();
//builder.Services.AddScoped<ITeamsService, TeamsService>();
//builder.Services.AddScoped<IUmpiresService, UmpiresService>();
//builder.Services.AddScoped<IUserService, UserService>();

//// Configure JWT Authentication
//var jwtKey = builder.Configuration["JwtSettings:Key"];
//if (string.IsNullOrEmpty(jwtKey))
//{
//    throw new InvalidOperationException("JWT Key is not configured. Please set 'JwtSettings:Key' in appsettings.json.");
//}
//var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.RequireHttpsMetadata = false; // Disable in development; set to true in production with HTTPS
//    options.SaveToken = true;
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
//        ValidateIssuer = false,
//        ValidateAudience = false
//    };

//    options.Events = new JwtBearerEvents
//    {
//        OnMessageReceived = context =>
//        {
//            var accessToken = context.Request.Query["access_token"];
//            var path = context.HttpContext.Request.Path;
//            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/scoreHub"))
//            {
//                context.Token = accessToken;
//            }
//            return Task.CompletedTask;
//        }
//    };
//});

//// Configure CORS
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("CorsPolicy",
//        builder => builder
//            .WithOrigins("http://localhost:3001") // Specific origin for development
//            .AllowAnyMethod()
//            .AllowAnyHeader()
//            .AllowCredentials()); // Required for Authorization header
//});

//// Configure Swagger
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen(c =>
//{
//    c.SwaggerDoc("v1", new OpenApiInfo { Title = "IPL Live API", Version = "v1" });

//    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//    {
//        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
//        Name = "Authorization",
//        In = ParameterLocation.Header,
//        Type = SecuritySchemeType.ApiKey,
//        Scheme = "Bearer"
//    });

//    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
//    {
//        {
//            new OpenApiSecurityScheme
//            {
//                Reference = new OpenApiReference
//                {
//                    Type = ReferenceType.SecurityScheme,
//                    Id = "Bearer"
//                }
//            },
//            new string[] {}
//        }
//    });
//});

//var app = builder.Build();

//// Call RegisterAdminUser at startup
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    try
//    {
//        var authService = services.GetRequiredService<IAuthService>();
//        // Use GetAwaiter().GetResult() to handle async in a non-async context
//        var (success, message) = authService.RegisterAdminUser().GetAwaiter().GetResult();
//        Console.WriteLine(message);
//    }
//    catch (Exception ex)
//    {
//        Console.WriteLine($"Error registering admin user: {ex.Message}");
//    }
//}

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//    // Disable HTTPS redirection in development to avoid CORS preflight issues
//}
//else
//{
//    app.UseExceptionHandler("/Error");
//    app.UseHsts();
//    app.UseHttpsRedirection(); // Enable only in production
//}

//app.UseCors("CorsPolicy"); // Ensure CORS is applied before authentication
//app.UseAuthentication();
//app.UseAuthorization();

//app.MapControllers();
//app.MapHub<ScoreHub>("/scoreHub");

//app.Run();
using IPLLive.API.Data;
using IPLLive.API.Data.Repositories;
using IPLLive.API.Hubs;
using IPLLive.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve; // Handle cycles
        options.JsonSerializerOptions.MaxDepth = 64; // Increase max depth if needed
    });

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add SignalR for real-time updates
builder.Services.AddSignalR();

// Configure Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();
builder.Services.AddScoped<IBallByBallRepository, BallByBallRepository>();
builder.Services.AddScoped<IPointTableRepository, PointTableRepository>();
builder.Services.AddScoped<ISeasonRepository, SeasonRepository>();
builder.Services.AddScoped<IUmpiresRepository, UmpiresRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();

// Configure Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IMatchService, MatchService>();
builder.Services.AddScoped<IScoreService, ScoreService>();
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<IBallByBallService, BallByBallService>();
builder.Services.AddScoped<IPointTableService, PointTableService>();
builder.Services.AddScoped<ISeasonService, SeasonService>();
builder.Services.AddScoped<ITeamsService, TeamsService>();
builder.Services.AddScoped<IUmpiresService, UmpiresService>();
builder.Services.AddScoped<IUserService, UserService>();

// Configure JWT Authentication
var jwtKey = builder.Configuration["JwtSettings:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not configured. Please set 'JwtSettings:Key' in appsettings.json.");
}
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Disable in development; set to true in production with HTTPS
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = false,
        ValidateAudience = false
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/scoreHub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
            .WithOrigins("http://localhost:3001") // Specific origin for development
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()); // Required for Authorization header
});

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "IPL Live API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Call RegisterAdminUser at startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var authService = services.GetRequiredService<IAuthService>();
        // Use GetAwaiter().GetResult() to handle async in a non-async context
        var (success, message) = authService.RegisterAdminUser().GetAwaiter().GetResult();
        Console.WriteLine(message);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error registering admin user: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // Disable HTTPS redirection in development to avoid CORS preflight issues
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
    app.UseHttpsRedirection(); // Enable only in production
}

app.UseCors("CorsPolicy"); // Ensure CORS is applied before authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ScoreHub>("/scoreHub");

app.Run();