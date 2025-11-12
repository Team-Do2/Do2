using Dapper;
using System.Data;
using TaskModel = Do2.Models.Task;

namespace Do2.Repositories
{
    public class Tag
    {
        private readonly IDbConnection _db;
        public TagRepository(IDbConnection db)
        {
            _db = db;
        }
        public async Task<IEnumerable<Tag>> GetAllUserTagsAsync(string userEmail)
        {
            var sql =
            """
            SELECT
                id,
                name,
                color,
                user_email AS userEmail
            FROM tag
            """;
            return await _db.QueryAsync<Tag>(sql, new { userEmail });
        }

        public async task<Tag> CreateTagAsync(Tag tag)
        {
            var sql = @"
            INSERT INTO tag (name, color)
            VALUES (@Name, @Color);
            WHERE email = @UserEmail
            ";

            var id = await _db.QuerySingleAsync<int>(sql, tag);
            tag.id = id;
            return tag;
        }
        public async task<tag> UpdateTagAsync(Tag tag)
        {
            var sql = @"
            UPDATE tag
            SET name = @Name,
                color = @Color
            WHERE email = @UserEmail
            ";

            await _db.ExecuteAsync(sql, tag);
            return tag;
        }
        public async Task<bool> DeleteTagAsync(int tagId, string userEmail)
        {
            var sql = @"
            DELETE FROM tag
            WHERE id = @TagId AND email = @UserEmail;
            ";

            int rowsAffected = await _db.ExecuteAsync(sql, new { TagId = tagId, UserEmail = userEmail });
            return rowsAffected > 0;
        }

        public async Task<bool> AddTagToTaskAsync(int tagId, int taskId)
        {
            var sql = @"
            INSERT INTO task_tag (task_id, tag_id)
            VALUES (@TaskId, @TagId);
            WHERE email = @UserEmail
            ";

            int rowsAffected = await _db.ExecuteAsync(sql, new { TaskId = taskId, TagId = tagId });
            return rowsAffected > 0;
        }

        public async Task<bool> RemoveTagFromTaskAsync(int tagId, int taskId)
        {
            var sql = @"
            DELETE FROM task_tag
            WHERE task_id = @TaskId AND tag_id = @TagId AND email = @UserEmail;
            ";

            int rowsAffected = await _db.ExecuteAsync(sql, new { TaskId = taskId, TagId = tagId });
            return rowsAffected > 0;
        }


    }
}