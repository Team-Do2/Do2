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

        public async Task<IEnumerable<TaskModel>> GetAllUserTasksAsync(string userEmail)
        {
            var sql =
            """
            SELECT
                id,
                is_pinned AS isPinned,
                is_done AS isDone,
                name,
                datetime_to_delete AS datetimeToDelete,
                description,
                supertask_id AS supertaskId,
                user_email AS userEmail
            FROM task
            WHERE user_email = @userEmail
            """;
            return await _db.QueryAsync<TaskModel>(sql, new { userEmail });
        }

        public async Task<IEnumerable<TaskModel>> GetPinnedUserTasksAsync(string userEmail)
        {
            var sql = """
            SELECT
                id,
                is_pinned AS isPinned,
                is_done AS isDone,
                name,
                datetime_to_delete AS datetimeToDelete,
                description,
                supertask_id AS supertaskId,
                user_email AS userEmail
            FROM task
            WHERE user_email = @userEmail AND is_pinned = 1
            """;
            return await _db.QueryAsync<TaskModel>(sql, new { userEmail });
        }

        public async Task<IEnumerable<TaskModel>> GetUserTasksBySearchAsync(string userEmail, string search)
        {
            var sql = @"
            SELECT
                id,
                is_pinned AS isPinned,
                is_done AS isDone,
                name,
                datetime_to_delete AS datetimeToDelete,
                description,
                supertask_id AS supertaskId,
                user_email AS userEmail
            FROM task
            WHERE user_email = @userEmail
              AND name LIKE CONCAT('%', @search, '%')
            ORDER BY
            (LENGTH(@search) / LENGTH(name)) DESC,
            LOCATE(@search, name),
            name ASC
            ";
            return await _db.QueryAsync<TaskModel>(sql, new { userEmail, search });
        }

        public async Task<int> AddUserTaskAsync(TaskModel task)
        {
            var sql = "INSERT INTO task (name, description, user_email) VALUES (@name, @description, @userEmail); SELECT LAST_INSERT_ID();";
            return await _db.ExecuteScalarAsync<int>(sql, new { task.name, task.description, userEmail = task.userEmail });
        }

        public async Task<int> AddDeadlineTaskAsync(int taskId, DateTime datetime)
        {
            var sql = "INSERT INTO deadline_task (task_id, due_datetime) VALUES (@taskId, @datetime); SELECT LAST_INSERT_ID();";
            return await _db.ExecuteScalarAsync<int>(sql, new { taskId, datetime });
        }

        public async Task<int> AddSubtaskRelationship(int supertaskId, int subtaskId)
        {
            var sql = "UPDATE task SET supertask_id = @supertaskId WHERE id = @subtaskId";
            return await _db.ExecuteAsync(sql, new { supertaskId, subtaskId });
        }

        public async Task<int> UpdateTaskPinnedAsync(int taskId, bool isPinned)
        {
            var sql = "UPDATE task SET is_pinned = @isPinned WHERE id = @taskId";
            return await _db.ExecuteAsync(sql, new { taskId, isPinned });
        }

        public async Task<int> UpdateTaskDoneAsync(int taskId, bool isDone)
        {
            var sql = "UPDATE task SET is_done = @isDone WHERE id = @taskId";
            return await _db.ExecuteAsync(sql, new { taskId, isDone });
        }

        public async Task<int> UpdateTaskDescriptionAsync(int taskId, string description)
        {
            var sql = "UPDATE task SET description = @description WHERE id = @id";
            return await _db.ExecuteAsync(sql, new { id = taskId, description });
        }

        public async Task<int> UpdateTaskNameAsync(int taskId, string name)
        {
            var sql = "UPDATE task SET name = @name WHERE id = @id";
            return await _db.ExecuteAsync(sql, new { id = taskId, name });
        }

        public async Task<int> UpdateTaskSupertaskAsync(int taskId, int? supertaskId)
        {
            var sql = "UPDATE task SET supertask_id = @supertaskId WHERE id = @taskId";
            return await _db.ExecuteAsync(sql, new { taskId, supertaskId });
        }

        public async Task<int> UpdateTaskDueDateAsync(int taskId, DateTime? dueDate)
        {
            if (dueDate.HasValue)
            {
                var deleteSql = "DELETE FROM deadline_task WHERE task_id = @taskId";
                await _db.ExecuteAsync(deleteSql, new { taskId });
                var insertSql = "INSERT INTO deadline_task (task_id, due_datetime) VALUES (@taskId, @dueDate)";
                return await _db.ExecuteAsync(insertSql, new { taskId, dueDate });
            }
            else
            {
                var sql = "DELETE FROM deadline_task WHERE task_id = @taskId";
                return await _db.ExecuteAsync(sql, new { taskId });
            }
        }

        public async Task<IEnumerable<(int taskId, DateTime dueDate)>> GetDueDatesForTasksAsync(List<int> taskIds)
        {
            var sql = "SELECT task_id AS taskId, due_datetime AS dueDate FROM deadline_task WHERE task_id IN @taskIds";
            return await _db.QueryAsync<(int taskId, DateTime dueDate)>(sql, new { taskIds });
        }

        public async Task<int> DeleteTaskAsync(int id)
        {
            var sql = "DELETE FROM task WHERE id = @id";
            return await _db.ExecuteAsync(sql, new { id });
        }

        public async Task<int> DeleteAllStaleTasksAsync(string email) {
            var sql = "DELETE FROM task WHERE user_email = @userEmail AND datetime_to_delete < NOW()";
            return await _db.ExecuteAsync(sql, new { userEmail = email });
        }

        public async Task<IEnumerable<TaskModel>> GetSubtasksForTaskAsync(int taskId)
        {
            var sql =
            """
            SELECT
                id,
                is_pinned AS isPinned,
                is_done AS isDone,
                name,
                datetime_to_delete AS datetimeToDelete,
                description,
                supertask_id AS supertaskId,
                user_email AS userEmail
            FROM task
            WHERE supertask_id = @taskId
            """;
            return await _db.QueryAsync<TaskModel>(sql, new { taskId });
        }

    }
}