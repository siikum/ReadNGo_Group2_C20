namespace ReadNGo_Group2_C20.Services.Implementations
{
    using System.Net;
    using System.Net.Mail;
    using Microsoft.Extensions.Configuration;
    using ReadNGo.Services.Interfaces;
    using ReadNGo_Group2_C20.Services.Interfaces;

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendOrderConfirmation(
           string toEmail,
           string userName,
           int userId,
           List<string> bookTitles,
           string claimCode,
           decimal totalBeforeDiscount,
           decimal discountPercent,
           decimal totalAfterDiscount)
        {
            try
            {
                var fromEmail = _config["SMTP:From"];
                var password = _config["SMTP:Password"];

                var client = new SmtpClient(_config["SMTP:Host"], int.Parse(_config["SMTP:Port"]))
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(fromEmail, password)
                };

                var subject = "ReadNGo - Order Confirmation";

                var booksList = string.Join("\n - ", bookTitles);

                var body = $@"
Dear {userName},

📦 Your order has been successfully placed!

🧾 Order Summary:
----------------------------------------
👤 User ID: {userId}
👤 Name: {userName}
📚 Books:
 - {booksList}
💳 Total (Before Discount): Rs. {totalBeforeDiscount}
🏷️ Discount Applied: {discountPercent}%
💰 Final Amount to Pay: Rs. {totalAfterDiscount}
🔐 Claim Code: {claimCode}
----------------------------------------

📍 Store Pickup Address:
Baluwatar, Kathmandu

Please bring your claim code and membership ID to collect your books.

Thank you for shopping with us!

Regards,  
📘 ReadNGo Team";

                var message = new MailMessage(fromEmail, toEmail, subject, body);
                client.Send(message);
                Console.WriteLine($"✅ Email sent to {toEmail} with claim code {claimCode}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("EMAIL ERROR: " + ex.Message);
            }
        }

    }

}
