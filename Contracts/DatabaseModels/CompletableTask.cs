namespace Do2.Models.DatabaseModels
{
    public class CompletableTask
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public bool IsCompleted { get; set; }

        public required string UserEmail { get; set;}
    }
}