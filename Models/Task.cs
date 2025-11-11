namespace Do2.Models
{
    public class Task
    {
        public int id { get; set; }
        public bool isPinned { get; set; }
        public bool isDone { get; set; }
        public string? name { get; set; }
        public DateTime? datetimeToDelete { get; set; }
        public string? description { get; set; }
        public int? supertaskId { get; set; }
        public string userEmail { get; set; }
    }
}