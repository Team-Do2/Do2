namespace Do2.Models.DatabaseModels
{
    public class CompletableTask
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public bool IsCompleted { get; set; }
    }
}