namespace Do2.Models
{
    public class TaskModel
    {
        public int id { get; set; }
        public bool isPinned { get; set; }
        public bool isDone { get; set; }
        public string? name { get; set; }
        public DateTime? datetimeToDelete { get; set; }
        public string? description { get; set; }
        public int? supertaskId { get; set; }
        public required string userEmail { get; set; }

        // Hydrated Information
        public List<Tag>? Tags { get; set; } = new();
        public DateTime? dueDate { get; set; }
        public List<TaskModel>? Subtasks { get; set; } = new();
    }
}