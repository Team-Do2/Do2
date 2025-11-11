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

        public Task<IEnumerable<TaskModel>> GetAllTasksAsync() => _repository.GetAllTasksAsync();
        public Task<TaskModel?> GetTaskByIdAsync(int id) => _repository.GetTaskByIdAsync(id);
        public Task<int> AddTaskAsync(TaskModel task) => _repository.AddTaskAsync(task);
        public Task<int> UpdateTaskAsync(TaskModel task) => _repository.UpdateTaskAsync(task);
        public Task<int> UpdateTaskDoneAsync(int taskId, bool isDone) => _repository.UpdateTaskDoneAsync(taskId, isDone);
        public Task<int> UpdateTaskPinnedAsync(int taskId, bool isPinned) => _repository.UpdateTaskPinnedAsync(taskId, isPinned);
    }
}