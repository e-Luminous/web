using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class Account
    {
        [Key]
        public string UserId { get; set; }

        public string UserName { get; set; }
        public string Role { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        public string UserEmail { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string UserPassword { get; set; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        public string UserPhone { get; set; }
        
        public bool EmailConfirmed { get; set; }
        public bool PhoneConfirmed { get; set; }
        public bool TwoFaEnabled { get; set; }
        public int AccessFailed { get; set; }
        public bool AccountLocked { get; set; }
    }
}