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
            var sql = "SELECT id, name, is_done AS isDone, is_pinned AS isPinned FROM task";
            return await _db.QueryAsync<TaskModel>(sql);
        }

        public async Task<TaskModel?> GetTaskByIdAsync(int id)
        {
            var sql = "SELECT id, name, is_done AS isDone, is_pinned AS isPinned FROM task WHERE id = @id";
            return await _db.QueryFirstOrDefaultAsync<TaskModel>(sql, new { id });
        }


        public async Task<int> AddTaskAsync(TaskModel task)
        {
            var sql = "INSERT INTO task (name, is_done, is_pinned) VALUES (@name, @isDone, @isPinned); SELECT LAST_INSERT_ID();";
            return await _db.ExecuteScalarAsync<int>(sql, task);
        }

        public async Task<int> UpdateTaskAsync(TaskModel task)
        {
            var sql = "UPDATE task SET name = @name, is_done = @isDone, is_pinned = @isPinned WHERE id = @id";
            return await _db.ExecuteAsync(sql, task);
        }

        public async Task<int> UpdateTaskDoneAsync(int taskId, bool isDone)
        {
            var sql = "UPDATE task SET is_done = @isDone WHERE id = @taskId";
            return await _db.ExecuteAsync(sql, new { taskId, isDone });
        }

        public async Task<int> UpdateTaskPinnedAsync(int taskId, bool isPinned)
        {
            var sql = "UPDATE task SET is_pinned = @isPinned WHERE id = @taskId";
            return await _db.ExecuteAsync(sql, new { taskId, isPinned });
        }
    }
}