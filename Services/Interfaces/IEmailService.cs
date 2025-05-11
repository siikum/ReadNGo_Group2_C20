namespace ReadNGo_Group2_C20.Services.Interfaces
{
    public interface IEmailService
    {
        void SendOrderConfirmation(
            string toEmail, 
            string userName, 
            int userId,
            string membershipId,
            List<string> bookTitles, 
            string claimCode, 
            decimal totalBeforeDiscount, 
            decimal discountPercent, 
            decimal totalAfterDiscount);
    }

}
