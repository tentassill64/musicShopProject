using musicShopProject;
using musicShopProject.Tools.Extensions;

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

app.UseCors(builder => builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
);

app.UseExceptionsHandler();
app.UseStaticFiles();
app.MapControllers();
app.UseRouting();

app.Run();

