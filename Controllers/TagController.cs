using Do2.Services;
using Do2.Models;
using Microsoft.AspNetCore.Mvc;

namespace Do2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagController : ControllerBase
    {
        private readonly TagService _service;
        private ISessionService sessionService;

        public TagController(TagService service, ISessionService _sessionService)
        {
            _service = service;
            sessionService = _sessionService;
        }

        [HttpGet]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult<IEnumerable<Tag>>> GetAllUserTags([FromQuery] string userEmail)
        {
            var tags = await _service.GetAllUserTagsAsync(userEmail);
            System.Console.WriteLine("Tag Controller Called");
            return Ok(tags);
        }

        [HttpPost]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult<Tag>> CreateTag([FromBody] Tag tag)
        {
            var created = await _service.CreateTagAsync(tag);
            return CreatedAtAction(nameof(GetAllUserTags), new { tag.userEmail }, created);
        }

        [HttpPut]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult<Tag>> UpdateTag([FromBody] Tag tag)
        {
            var updated = await _service.UpdateTagAsync(tag);
            return Ok(updated);
        }

        [HttpDelete]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> DeleteTag([FromQuery] int tagId, [FromQuery] string userEmail)
        {
            var result = await _service.DeleteTagAsync(tagId, userEmail);
            if (result == 0) return NotFound();
            return NoContent();
        }

        [HttpPost("add-to-task")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> AddTagToTask([FromQuery] int tagId, [FromQuery] int taskId)
        {
            var result = await _service.AddTagToTaskAsync(tagId, taskId);
            if (result == 0) return NotFound();
            return Ok();
        }

        [HttpPost("remove-from-task")]
        [ServiceFilter(typeof(CheckSession))]
        public async Task<ActionResult> RemoveTagFromTask([FromQuery] int tagId, [FromQuery] int taskId)
        {
            var result = await _service.RemoveTagFromTaskAsync(tagId, taskId);
            if (result == 0) return NotFound();
            return Ok();
        }
    }
}