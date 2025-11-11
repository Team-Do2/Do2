namespace Do2.Models
{
    public class Task
    {
        public int id { get; set; }
        public string? name { get; set; }
        public bool isDone { get; set; }
        public bool isPinned { get; set; }
    }
}