using Do2.Contracts.Services;
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
        private ISessionService sessionService;

        public TaskController(CompletableTaskService service, ISessionService _sessionService)
        {
            _service = service;
            sessionService = _sessionService;
        }

        [HttpGet]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<IEnumerable<CompletableTask>> GetAll() => await _service.GetAllTasksAsync();

        [HttpGet("{id}")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult<CompletableTask>> GetById(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return task;
        }

        [HttpPost]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult<int>> Add(CompletableTask task)
        {
            var id = await _service.AddTaskAsync(task);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> Update(CompletableTask task)
        {
            var result = await _service.UpdateTaskAsync(task);
            if (result == 0) return NotFound();
            return NoContent();
        }
    }
}