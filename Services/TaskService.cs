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
            var tasks = (await _repository.GetAllUserTasksAsync(userEmail)).ToList();
            await HydrateTasks(tasks);
            return tasks;
        }
        public async Task<IEnumerable<TaskModel>> GetPinnedUserTasksAsync(string userEmail)
        {
            var tasks = (await _repository.GetPinnedUserTasksAsync(userEmail)).ToList();
            await HydrateTasks(tasks);
            return tasks;
        }
        public async Task<IEnumerable<TaskModel>> GetUserTasksBySearchAsync(string userEmail, string search)
        {
            var tasks = (await _repository.GetUserTasksBySearchAsync(userEmail, search)).ToList();
            await HydrateTasks(tasks, true);
            return tasks;
        }

        private async Task HydrateTasks(List<TaskModel> tasks, bool includeSubtasks = false)
        {
            // Fetch and assign tags for each task
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

            // Fetch and assign due dates for each task
            var dueDateData = await _repository.GetDueDatesForTasksAsync(taskIds);
            var dueDateDict = dueDateData.ToDictionary(x => x.taskId, x => x.dueDate);
            foreach (var task in tasks)
            {
                if (dueDateDict.TryGetValue(task.id, out var dueDate))
                {
                    task.dueDate = dueDate;
                }
            }

            // Assign subtasks for each task + Remove subtasks from main list
            foreach (var task in tasks)
            {
                task.Subtasks = (await _repository.GetSubtasksForTaskAsync(task.id)).ToList();
                await HydrateTasks(task.Subtasks, true);
            }
            if (!includeSubtasks) {
                tasks.RemoveAll(t => t.supertaskId != null);
            }
        }

        public Task<int> AddUserTaskAsync(TaskModel task) => _repository.AddUserTaskAsync(task);
        public Task<int> AddDeadlineTaskAsync(int taskId, DateTime datetime) => _repository.AddDeadlineTaskAsync(taskId, datetime);
        public Task<int> AddSubtaskRelationship(int supertaskId, int subtaskId) => _repository.AddSubtaskRelationship(supertaskId, subtaskId);
        public Task<int> UpdateTaskPinnedAsync(int taskId, bool isPinned) => _repository.UpdateTaskPinnedAsync(taskId, isPinned);
        public Task<int> UpdateTaskDoneAsync(int taskId, bool isDone) => _repository.UpdateTaskDoneAsync(taskId, isDone);
        public Task<int> UpdateTaskDescriptionAsync(int taskId, string description) => _repository.UpdateTaskDescriptionAsync(taskId, description);
        public Task<int> UpdateTaskNameAsync(int taskId, string name) => _repository.UpdateTaskNameAsync(taskId, name);
        public Task<int> UpdateTaskSupertaskAsync(int taskId, int? supertaskId) => _repository.UpdateTaskSupertaskAsync(taskId, supertaskId);
        public Task<int> UpdateTaskDueDateAsync(int taskId, DateTime? dueDate) => _repository.UpdateTaskDueDateAsync(taskId, dueDate);
        public Task<int> DeleteTaskAsync(int id) => _repository.DeleteTaskAsync(id);
        public async Task<int> DeleteAllStaleTasksAsync(string email) => await _repository.DeleteAllStaleTasksAsync(email);
    }
}