using System;
using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class Student
    {
        [Key]
        public int Serial { get; set; }
        public string CollegeId { get; set; }
        public string Shift { get; set; }
        public string HscBatch { get; set; }
        
        // Relations
        public Account Account { get; set; }
        public Institution Institution { get; set; }
    }
}