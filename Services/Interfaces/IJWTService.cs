using ReadNGo_Group2_C20.Models;

namespace ReadNGo_Group2_C20.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(Guid userId, string email, string fullName, string role);
    }
}