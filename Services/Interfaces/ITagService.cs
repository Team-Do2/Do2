using TaskModel = Do2.Models.Task;

namespace Do2.Services;

public interface ITagService
{
    public Task<bool> CreateTag(Tag Tag);
    public Task<bool> UpdateTag(int TagID, Tag TagProperties);
    public Task<bool> DeleteTag(int TagID);
    public Task<bool> AddTagToTask(int TagID, int TaskID);
    public Task<bool> RemoveTagFromTask(int TagID, int TaskID);
    public Task<TaskModel[]> SearchByTag(int TagID);
}