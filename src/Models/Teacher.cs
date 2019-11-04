using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace src.Models
{
    public class Teacher
    {
        [Key] public int Serial { get; set; }
        
        [Display(Name = "Your Employee Id")]
        public string CollegeId { get; set; }
        
        [Display(Name = "Shift You Teach")]
        public string Shift { get; set; }
        
        // Relations
        public Account Account { get; set; }
        public Course Course { get; set; }
        public Institution Institution { get; set; }
        public List<Classroom> Classrooms { get; set; }
        public List<Submission> Submissions { get; set; }
        
        [NotMapped]
        public List<SelectListItem> Shifts { get; } = new List<SelectListItem>
        {
            new SelectListItem{ Value = "Morning" , Text = "Morning Shift" },
            new SelectListItem{ Value = "Day" , Text = "Day Shift" },
            new SelectListItem{ Value = "FullDay" , Text = "Full Day" },
            new SelectListItem{ Value = "Afternoon" , Text = "Afternoon Shift" }
        };
        
        [NotMapped]
        public List<SelectListItem> Courses { get; } = new List<SelectListItem>();
        
        [NotMapped]
        public List<SelectListItem> Institutions { get; } = new List<SelectListItem>();
    }
}