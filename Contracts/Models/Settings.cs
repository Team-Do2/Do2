namespace Do2.Models
{
    public class Settings
    {
        public required string userEmail { get; set; }

        public string theme { get; set; } = "light";

        public int timeToDelete { get; set; }
    }
}