using Autofac;
using Autofac.Extensions.DependencyInjection;
using MySql.Data.MySqlClient;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add MVC controllers
builder.Services.AddControllers();

// Use Autofac as DI container
builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
	// Register MySQL connection for Dapper
	containerBuilder.Register(c =>
	{
		var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
		return new MySqlConnection(connectionString);
	}).As<IDbConnection>().InstancePerLifetimeScope();

	// Register repository and service
	containerBuilder.RegisterType<Do2.Repositories.TaskRepository>().AsSelf().InstancePerLifetimeScope();
	containerBuilder.RegisterType<Do2.Services.TaskService>().AsSelf().InstancePerLifetimeScope();
});

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

app.MapControllers();

app.MapGet("/", () => "Hello World!");

app.Run();
