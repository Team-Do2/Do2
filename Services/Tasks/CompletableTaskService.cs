using Do2.Repositories;
using Do2.Models.DatabaseModels;

namespace Do2.Services
{
    public class CompletableTaskService
    {
        private readonly TaskRepository _repository;
        public CompletableTaskService(TaskRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<CompletableTask>> GetAllTasksAsync() => _repository.GetAllTasksAsync();
        public Task<CompletableTask?> GetTaskByIdAsync(int id) => _repository.GetTaskByIdAsync(id);
        public Task<int> AddTaskAsync(CompletableTask task) => _repository.AddTaskAsync(task);
        public Task<int> UpdateTaskAsync(CompletableTask task) => _repository.UpdateTaskAsync(task);
    }
}