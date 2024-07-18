using Microsoft.EntityFrameworkCore.Migrations;
using musicShopProject;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.Initialize(builder.Environment.EnvironmentName);

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(); 
app.MapControllers();
app.Run();

