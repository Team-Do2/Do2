using Do2.Repositories;
using Tag = Do2.Models.Tag;

namespace Do2.Services
{
    public class TagService
    {
        private readonly TagRepository _tagRepository;

        public TagService(TagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public Task<IEnumerable<Tag>> GetAllUserTagsAsync(string userEmail) => _tagRepository.GetAllUserTagsAsync(userEmail);

        public Task<Tag> CreateTagAsync(Tag tag) => _tagRepository.CreateTagAsync(tag);

        public Task<Tag> UpdateTagAsync(Tag tag) => _tagRepository.UpdateTagAsync(tag);

        public Task<int> DeleteTagAsync(int tagId, string userEmail) => _tagRepository.DeleteTagAsync(tagId, userEmail);

        public Task<int> AddTagToTaskAsync(int tagId, int taskId) => _tagRepository.AddTagToTaskAsync(tagId, taskId);

        public Task<int> RemoveTagFromTaskAsync(int tagId, int taskId) => _tagRepository.RemoveTagFromTaskAsync(tagId, taskId);
    }
}