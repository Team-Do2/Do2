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
            var sql = "SELECT id, name, is_done AS isDone FROM task";
            return await _db.QueryAsync<TaskModel>(sql);
        }

        public async Task<TaskModel?> GetTaskByIdAsync(int id)
        {
            var sql = "SELECT id, name, is_done AS isDone FROM task WHERE id = @id";
            return await _db.QueryFirstOrDefaultAsync<TaskModel>(sql, new { id });
        }

        public async Task<int> AddTaskAsync(TaskModel task)
        {
            var sql = "INSERT INTO task (name, is_done) VALUES (@name, @isDone); SELECT LAST_INSERT_ID();";
            return await _db.ExecuteScalarAsync<int>(sql, task);
        }

        public async Task<int> UpdateTaskAsync(TaskModel task)
        {
            var sql = "UPDATE task SET name = @name, is_done = @isDone WHERE id = @id";
            return await _db.ExecuteAsync(sql, task);
        }
    }
}