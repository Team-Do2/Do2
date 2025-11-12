using Dapper;
using System.Data;
using Tag = Do2.Models.Tag;

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
            WHERE user_email = @userEmail
            ";

            await _db.ExecuteAsync(sql, new { tag.name, tag.color, tag.userEmail });
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