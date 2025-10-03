using Dapper;
using System.Data;
using TaskModel = Do2.Models.Task;

namespace Do2.Repositories
{
    public class TaskRepository
    {
        private readonly IDbConnection _db;
        public TaskRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<IEnumerable<TaskModel>> GetAllTasksAsync()
        {
            await Task.Delay(2000); // Fake delay to simulate loading TODO: remove this
            var sql = "SELECT Id, Name, IsCompleted FROM Tasks";
            return await _db.QueryAsync<TaskModel>(sql);
        }

        public async Task<TaskModel?> GetTaskByIdAsync(int id)
        {
            var sql = "SELECT Id, Name, IsCompleted FROM Tasks WHERE Id = @Id";
            return await _db.QueryFirstOrDefaultAsync<TaskModel>(sql, new { Id = id });
        }

        public async Task<int> AddTaskAsync(TaskModel task)
        {
            var sql = "INSERT INTO Tasks (Name, IsCompleted) VALUES (@Name, @IsCompleted); SELECT LAST_INSERT_ID();";
            return await _db.ExecuteScalarAsync<int>(sql, task);
        }

        public async Task<int> UpdateTaskAsync(TaskModel task)
        {
            var sql = "UPDATE Tasks SET Name = @Name, IsCompleted = @IsCompleted WHERE Id = @Id";
            return await _db.ExecuteAsync(sql, task);
        }
    }
}