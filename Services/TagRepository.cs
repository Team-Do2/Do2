using Dapper;
using Do2.Models;
using System.Data;

namespace Do2.Repositories
{
    public class TagRepository
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
            WHERE user_email = @userEmail
            """;
            return await _db.QueryAsync<Tag>(sql, new { userEmail });
        }

        public async Task<IEnumerable<(int taskId, Tag tag)>> GetTagsForTasksAsync(IEnumerable<int> taskIds)
        {
            var sql =
            """
            SELECT
                tb.task_id AS taskId,
                t.id,
                t.name,
                t.color,
                t.user_email AS userEmail
            FROM tag t
            JOIN tagged_by tb ON t.id = tb.tag_id
            WHERE tb.task_id IN @taskIds
            """;
            var results = await _db.QueryAsync<(int taskId, int id, string name, string color, string userEmail)>(sql, new { taskIds });
            return results.Select(r => (r.taskId, new Tag { id = r.id, name = r.name, color = r.color, userEmail = r.userEmail }));
        }
        public async Task<Tag> CreateTagAsync(Tag tag)
        {
            var sql = @"
            INSERT INTO tag (name, color, user_email)
            VALUES (@name, @color, @userEmail);
            SELECT LAST_INSERT_ID();
            ";

            return await _db.QuerySingleAsync<Tag>(sql , new { tag.name, tag.color, tag.userEmail });
        }
        public async Task<Tag> UpdateTagAsync(Tag tag)
        {
            var sql = @"
            UPDATE tag
            SET name = @name,
                color = @color
            WHERE tag.id = @id;
            ";

            await _db.ExecuteAsync(sql, new { tag.name, tag.color, tag.id });
            return tag;
        }
        public async Task<int> DeleteTagAsync(int tagId, string userEmail)
        {
            var sql = @"
            DELETE FROM tag
            WHERE id = @tagId AND user_email = @userEmail;
            ";
            return await _db.ExecuteAsync(sql, new { tagId, userEmail });
        }

        public async Task<int> AddTagToTaskAsync(int tagId, int taskId)
        {
            var sql = @"
            INSERT INTO tagged_by (task_id, tag_id)
            VALUES (@taskId, @tagId);
            ";

            return await _db.ExecuteAsync(sql, new { taskId, tagId });
        }

        public async Task<int> RemoveTagFromTaskAsync(int tagId, int taskId)
        {
            var sql = @"
            DELETE FROM tagged_by
            WHERE task_id = @taskId AND tag_id = @tagId;
            ";

            return await _db.ExecuteAsync(sql, new { taskId, tagId });
        }
    }
}