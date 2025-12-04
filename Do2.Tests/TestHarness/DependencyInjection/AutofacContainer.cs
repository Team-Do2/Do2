using System.Data;
using System.Security.Cryptography;
using Do2.Repositories;
using Do2.Services;

using Autofac;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Logging;

public class AutofacFixture : IDisposable
{
    public IContainer Container { get; }

    public AutofacFixture()
    {
        var builder = new ContainerBuilder();

        // Register MySQL connection for Dapper
        builder.Register(c =>
        {
            return new MySqlConnection("Server=localhost;Port=3306;Database=do2;Uid=root;Pwd=test;");
        }).As<IDbConnection>().InstancePerLifetimeScope();
            
        builder.Register(c => NullLoggerFactory.Instance.CreateLogger("default"))
            .As<ILogger>()
            .SingleInstance();

        // Register repository and service
        builder.Register(c => RandomNumberGenerator.Create())
            .As<RandomNumberGenerator>()
            .SingleInstance();

        builder.RegisterType<UserRepositoryService>().AsImplementedInterfaces();
        builder.RegisterType<TaskRepository>().AsSelf().InstancePerLifetimeScope();
        builder.RegisterType<TagRepository>().AsSelf().InstancePerLifetimeScope();
        builder.RegisterType<TaskService>().AsSelf().InstancePerLifetimeScope();
        builder.RegisterType<AuthenticationService>().AsImplementedInterfaces();
        builder.RegisterType<UserService>().AsImplementedInterfaces();

        Container = builder.Build();
    }

    public void Dispose()
    {
        Container.Dispose();
    }
}