namespace ReadNGo_Group2_C20.Services.Interfaces
{
    public interface IEmailService
    {
        void SendOrderConfirmation(string toEmail, string userName, int userId, List<string> bookTitles, string claimCode, decimal totalBeforeDiscount, decimal discountPercent, decimal totalAfterDiscount);
    }

}
