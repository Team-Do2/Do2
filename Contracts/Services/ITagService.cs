using Do2.Models.DatabaseModels;

public interface ITagService
{
    public Task<bool> CreateTag(Tag Tag);
    public Task<bool> UpdateTag(int TagID, Tag TagProperties);
    public Task<bool> DeleteTag(int TagID);
    public Task<bool> AddTagToTask(int TagID, int TaskID);
    public Task<bool> RemoveTagFromTask(int TagID, int TaskID);
    public Task<CompletableTask[]> SearchByTag(int TagID);
}