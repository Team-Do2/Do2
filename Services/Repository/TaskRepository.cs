using Dapper;
using Do2.Contracts.Services;
using Do2.Models.DatabaseModels;
using System.Data;

namespace Do2.Repositories
{
    public class TaskRepositoryService : ICompletableTaskRepositoryService
    {
        private readonly IDbConnection _db;
        public TaskRepositoryService(IDbConnection db)
        {
            _db = db;
        }

        public async Task<IEnumerable<CompletableTask>> GetAllTasksAsync()
        {
            var sql = "SELECT id, name, is_done FROM task";
            return await _db.QueryAsync<CompletableTask>(sql);
        }

        public async Task<CompletableTask?> GetTaskByIdAsync(int id)
        {
            var sql = "SELECT id, name, is_done FROM task WHERE Id = @Id";
            return await _db.QueryFirstOrDefaultAsync<CompletableTask>(sql, new { Id = id });
        }

        public async Task<int> AddTaskAsync(CompletableTask task)
        {
            var sql = "INSERT INTO task (name, is_done) VALUES (@Name, @IsCompleted); SELECT LAST_INSERT_ID();";
            return await _db.ExecuteScalarAsync<int>(sql, task);
        }

        public async Task<int> UpdateTaskAsync(CompletableTask task)
        {
            var sql = "UPDATE task SET name = @Name, is_done = @IsCompleted WHERE id = @Id";
            return await _db.ExecuteAsync(sql, task);
        }
    }
}