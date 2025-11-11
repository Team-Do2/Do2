using Do2.Services;
using Microsoft.AspNetCore.Mvc;
using TaskModel = Do2.Models.Task;

namespace Do2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _service;
        public TaskController(TaskService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IEnumerable<TaskModel>> GetAll() => await _service.GetAllTasksAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskModel>> GetById(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Add(TaskModel task)
        {
            var id = await _service.AddTaskAsync(task);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut]
        public async Task<ActionResult> Update(TaskModel task)
        {
            var result = await _service.UpdateTaskAsync(task);
            if (result == 0) return NotFound();
            return Ok(task);
        }

        [HttpPatch("{taskId}/done")]
        public async Task<ActionResult> UpdateDone(int taskId, bool isDone)
        {
            var result = await _service.UpdateTaskDoneAsync(taskId, isDone);
            if (result == 0) return NotFound();
            return Ok();
        }

        [HttpPatch("{taskId}/pinned")]
        public async Task<ActionResult> UpdatePinned(int taskId, bool isPinned)
        {
            var result = await _service.UpdateTaskPinnedAsync(taskId, isPinned);
            if (result == 0) return NotFound();
            return Ok();
        }
    }
}