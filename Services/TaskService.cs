using System.ComponentModel.DataAnnotations;
using Do2.Repositories;
using TaskModel = Do2.Models.Task;

namespace Do2.Services
{
    public class TaskService
    {
        private readonly TaskRepository _repository;
        private readonly TagRepository _tagRepository;
        public TaskService(TaskRepository repository, TagRepository tagRepository)
        {
            _repository = repository;
            _tagRepository = tagRepository;
        }

        public async Task<IEnumerable<TaskModel>> GetAllUserTasksAsync(string userEmail)
        {
            var tasks = await _repository.GetAllUserTasksAsync(userEmail);
            await HydrateTasksWithTags(tasks);
            return tasks;
        }
        public async Task<IEnumerable<TaskModel>> GetPinnedUserTasksAsync(string userEmail)
        {
            var tasks = await _repository.GetPinnedUserTasksAsync(userEmail);
            await HydrateTasksWithTags(tasks);
            return tasks;
        }
        public async Task<IEnumerable<TaskModel>> GetUserTasksBySearchAsync(string userEmail, string search)
        {
            var tasks = await _repository.GetUserTasksBySearchAsync(userEmail, search);
            await HydrateTasksWithTags(tasks);
            return tasks;
        }

        private async Task HydrateTasksWithTags(IEnumerable<TaskModel> tasks)
        {
            var taskIds = tasks.Select(t => t.id).ToList();
            if (taskIds.Count != 0)
            {
                var tagData = await _tagRepository.GetTagsForTasksAsync(taskIds);
                var tagDict = tagData.GroupBy(x => x.taskId).ToDictionary(g => g.Key, g => g.Select(x => x.tag).ToList());
                foreach (var task in tasks)
                {
                    if (tagDict.TryGetValue(task.id, out var tags))
                    {
                        task.Tags = tags;
                    }
                }
            }
        }

        public Task<int> AddUserTaskAsync(string email, TaskModel task) => _repository.AddUserTaskAsync(email, task);
        public Task<int> AddDeadlineTaskAsync(int taskId, DateTime datetime) => _repository.AddDeadlineTaskAsync(taskId, datetime);
        public Task<int> AddSubtaskRelationship(int supertaskId, int subtaskId) => _repository.AddSubtaskRelationship(supertaskId, subtaskId);
        public Task<int> UpdateTaskPinnedAsync(int taskId, bool isPinned) => _repository.UpdateTaskPinnedAsync(taskId, isPinned);
        public Task<int> UpdateTaskDoneAsync(int taskId, bool isDone) => _repository.UpdateTaskDoneAsync(taskId, isDone);
        public Task<int> UpdateTaskDescriptionAsync(int taskId, string description) => _repository.UpdateTaskDescriptionAsync(taskId, description);
        public Task<int> DeleteTaskAsync(int id) => _repository.DeleteTaskAsync(id);
        public Task<int> DeleteAllStaleTasksAsync(string email) => _repository.DeleteAllStaleTasksAsync(email);
    }
}