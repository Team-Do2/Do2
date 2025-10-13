using System;
using Do2.Models.DatabaseModels;

namespace Do2.Contracts.Services;

public interface ICompletableTaskRepositoryService
{
    public Task<IEnumerable<CompletableTask>> GetAllTasksAsync();
    public Task<CompletableTask?> GetTaskByIdAsync(int id);
    public Task<int> AddTaskAsync(CompletableTask task);
    public Task<int> UpdateTaskAsync(CompletableTask task);
}
