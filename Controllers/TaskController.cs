using Do2.Models.DatabaseModels;
using Do2.Services;
using Microsoft.AspNetCore.Mvc;

namespace Do2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly CompletableTaskService _service;
        public TaskController(CompletableTaskService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IEnumerable<CompletableTask>> GetAll() => await _service.GetAllTasksAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<CompletableTask>> GetById(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Add(CompletableTask task)
        {
            var id = await _service.AddTaskAsync(task);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut]
        public async Task<ActionResult> Update(CompletableTask task)
        {
            var result = await _service.UpdateTaskAsync(task);
            if (result == 0) return NotFound();
            return NoContent();
        }
    }
}