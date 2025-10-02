var builder = WebApplication.CreateBuilder(args);

// Add CORS policy to allow frontend dev server
builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(policy =>
	{
		policy.WithOrigins("http://localhost:5173") // Vite default dev port
			  .AllowAnyHeader()
			  .AllowAnyMethod();
	});
});

var app = builder.Build();

app.UseStaticFiles();

// Use CORS middleware
app.UseCors();

app.MapGet("/", async () => {
	await Task.Delay(2000);
	return "Hello World!";
});

app.Run();
