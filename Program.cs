using Autofac;
using Autofac.Extensions.DependencyInjection;
using Do2.Contracts.Services;
using Do2.Repositories;
using Do2.Services;
using Do2.Services.User;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using System.Data;
using System.Security.Cryptography;

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
		containerBuilder.Register(c => RandomNumberGenerator.Create())
			.As<System.Security.Cryptography.RandomNumberGenerator>()
			.SingleInstance();
		containerBuilder.RegisterType<Logger<string>>().AsImplementedInterfaces();
		
		containerBuilder.RegisterType<UserRepositoryService>().AsImplementedInterfaces();
		containerBuilder.RegisterType<TaskRepositoryService>().AsSelf().InstancePerLifetimeScope();

		containerBuilder.RegisterType<CompletableTaskService>().AsSelf().InstancePerLifetimeScope();
		containerBuilder.RegisterType<AuthenticationService>().AsImplementedInterfaces();
		containerBuilder.RegisterType<UserService>().AsImplementedInterfaces();
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
