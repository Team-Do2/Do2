using Autofac;
using Autofac.Extensions.DependencyInjection;
using Do2.Repositories;
using Do2.Services;
using Do2.Services.Authentication;
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
		.As<RandomNumberGenerator>()
		.SingleInstance();
	containerBuilder.RegisterType<Logger<string>>().AsImplementedInterfaces();
	containerBuilder.RegisterType<SettingsRepository>().AsSelf().InstancePerLifetimeScope();
	containerBuilder.RegisterType<UserRepositoryService>().AsImplementedInterfaces();
	containerBuilder.RegisterType<TagRepository>().AsSelf().InstancePerLifetimeScope();
	containerBuilder.RegisterType<TagService>().AsSelf().InstancePerLifetimeScope();
	containerBuilder.RegisterType<TaskRepository>().AsSelf().InstancePerLifetimeScope();
	containerBuilder.RegisterType<SettingsService>().AsSelf().InstancePerLifetimeScope();
	containerBuilder.RegisterType<TaskService>().AsSelf().InstancePerLifetimeScope();
	containerBuilder.RegisterType<AuthenticationService>().AsImplementedInterfaces();
	containerBuilder.RegisterType<UserService>().AsImplementedInterfaces();
	containerBuilder.RegisterType<SessionService>().AsImplementedInterfaces().SingleInstance();

	containerBuilder.RegisterType<CheckSession>();
});

// Add CORS policy to allow frontend dev server
builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(policy =>
	{
		policy.WithOrigins("http://localhost:5173", "http://localhost:5015", "https://do2.chenevertsoftwareservices.com")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials();
	});
});

var app = builder.Build();

app.UseStaticFiles();

app.UseCors();

app.MapControllers();

app.Run();
