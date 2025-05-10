namespace ReadNGo_Group2_C20.Models
{
    public class Staff
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string Role { get; set; } = "Staff";
    }

}
