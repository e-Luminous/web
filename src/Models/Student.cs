using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.Rendering;
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
        public List<Submission> Submissions { get; set; }
        public List<StudentEnrollment> StudentEnrollments { get; set; }
        public Institution Institution { get; set; }
        
        [NotMapped]
        public List<SelectListItem> Shifts { get; } = new List<SelectListItem>
        {
            new SelectListItem{ Value = "Morning" , Text = "Morning Shift" },
            new SelectListItem{ Value = "Day" , Text = "Day Shift" },
            new SelectListItem{ Value = "FullDay" , Text = "Full Day" },
            new SelectListItem{ Value = "Afternoon" , Text = "Afternoon Shift" }
        };
        [NotMapped]
        public List<SelectListItem> Institutions { get; } = new List<SelectListItem>();
    }
}