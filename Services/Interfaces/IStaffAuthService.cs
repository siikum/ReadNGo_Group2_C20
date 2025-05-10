using ReadNGo_Group2_C20.DTO;

namespace ReadNGo_Group2_C20.Services.Interfaces
{
    public interface IStaffAuthService
    {
        StaffLoginResponseDTO Login(StaffLoginDTO loginDto);
    }
}