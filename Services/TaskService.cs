using Do2.Repositories;
using TaskModel = Do2.Models.Task;

namespace Do2.Services
{
    public class TaskService
    {
        private readonly TaskRepository _repository;
        public TaskService(TaskRepository repository)
        {
            _repository = repository;
        }

    public Task<IEnumerable<TaskModel>> GetAllUserTasksAsync(string userEmail) => _repository.GetAllUserTasksAsync(userEmail);
    public Task<IEnumerable<TaskModel>> GetPinnedUserTasksAsync(string userEmail) => _repository.GetPinnedUserTasksAsync(userEmail);
    public Task<IEnumerable<TaskModel>> GetUserTasksBySearchAsync(string userEmail, string search) => _repository.GetUserTasksBySearchAsync(userEmail, search);
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