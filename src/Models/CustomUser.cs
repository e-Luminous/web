using Microsoft.AspNetCore.Identity;

namespace src.Models
{
    public class CustomUser : IdentityUser
    {
        public string Role { get; set; }
    }
}