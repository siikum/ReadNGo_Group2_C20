namespace ReadNGo_Group2_C20.DTO
{
    public class StaffLoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class StaffLoginResponseDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}