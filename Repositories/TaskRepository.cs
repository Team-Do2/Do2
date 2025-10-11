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
            var sql = "SELECT id, name, is_done FROM task";
            return await _db.QueryAsync<TaskModel>(sql);
        }

        public async Task<TaskModel?> GetTaskByIdAsync(int id)
        {
            var sql = "SELECT id, name, is_done FROM task WHERE Id = @Id";
            return await _db.QueryFirstOrDefaultAsync<TaskModel>(sql, new { Id = id });
        }

        public async Task<int> AddTaskAsync(TaskModel task)
        {
            var sql = "INSERT INTO task (name, is_done) VALUES (@Name, @IsCompleted); SELECT LAST_INSERT_ID();";
            return await _db.ExecuteScalarAsync<int>(sql, task);
        }

        public async Task<int> UpdateTaskAsync(TaskModel task)
        {
            var sql = "UPDATE task SET name = @Name, is_done = @IsCompleted WHERE id = @Id";
            return await _db.ExecuteAsync(sql, task);
        }
    }
}