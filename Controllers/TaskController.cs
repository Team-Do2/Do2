using Do2.DTOs;
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
        private ISessionService sessionService;

        public TaskController(TaskService service, ISessionService _sessionService)
        {
            _service = service;
            sessionService = _sessionService;
        }

        [HttpGet("user/{userEmail}")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<IEnumerable<TaskModel>> GetAllUserTasks(string userEmail) => await _service.GetAllUserTasksAsync(userEmail);

        [HttpGet("user/{userEmail}/pinned")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<IEnumerable<TaskModel>> GetPinnedUserTasks(string userEmail) => await _service.GetPinnedUserTasksAsync(userEmail);

        [HttpGet("user/{userEmail}/search")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<IEnumerable<TaskModel>> GetUserTasksBySearch(string userEmail, [FromQuery] string search) => await _service.GetUserTasksBySearchAsync(userEmail, search);

        [HttpPost]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult<int>> AddUserTask([FromBody] TaskModel task)
        {
            var id = await _service.AddUserTaskAsync(task);
            return Created("", id);
        }

        [HttpPost("deadline")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult<int>> AddDeadlineTask([FromQuery] int taskId, [FromQuery] DateTime datetime)
        {
            var id = await _service.AddDeadlineTaskAsync(taskId, datetime);
            return Ok(id);
        }

        [HttpPost("subtask")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> AddSubtaskRelationship([FromQuery] int supertaskId, [FromQuery] int subtaskId)
        {
            var result = await _service.AddSubtaskRelationship(supertaskId, subtaskId);
            if (result == 0) return NotFound();
            return Ok();
        }

        [HttpPatch("{taskId}/pinned")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> UpdateTaskPinned(int taskId, [FromQuery] bool isPinned)
        {
            var result = await _service.UpdateTaskPinnedAsync(taskId, isPinned);
            if (result == 0) return NotFound();
            return Ok();
        }

        [HttpPatch("{taskId}/done")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> UpdateTaskDone(int taskId, [FromQuery] bool isDone)
        {
            var result = await _service.UpdateTaskDoneAsync(taskId, isDone);
            if (result == 0) return NotFound();
            return Ok();
        }


        [HttpPatch("{taskId}/description")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> UpdateTaskDescription(int taskId, UpdateTaskDescriptionRequest request)
        {
            var result = await _service.UpdateTaskDescriptionAsync(taskId, request.Description);
            if (result == 0) return NotFound();
            return Ok();
        }

        [HttpPatch("{taskId}/name")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> UpdateTaskName(int taskId, UpdateTaskNameRequest request)
        {
            var result = await _service.UpdateTaskNameAsync(taskId, request.Name);
            if (result == 0) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var result = await _service.DeleteTaskAsync(id);
            if (result == 0) return NotFound();
            return NoContent();
        }

        [HttpDelete("user/{userEmail}/stale")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> DeleteAllStaleTasks(string userEmail)
        {
            var result = await _service.DeleteAllStaleTasksAsync(userEmail);
            return Ok(result);
        }
    }
}