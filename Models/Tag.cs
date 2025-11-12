namespace Do2.Models
{
    public class Tag
    {
        public int id { get; set; }

        public required string name { get; set; }

        public required string color { get; set; }

        public required string userEmail { get; set; }
    }
}