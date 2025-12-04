namespace Do2.Models
{
    public class Settings
    {
        public required string userEmail { get; set; }

        public Themes theme { get; set; }

        public int timeToDelete { get; set; }
    }
}