using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class Teacher
    {
        [Key] public int Serial { get; set; }
        public string CollegeId { get; set; }
        public string Shift { get; set; }
        
        // Relations
        public Account Account { get; set; }
        public Course Course { get; set; }
        public Institution Institution { get; set; }
        public List<Classroom> Classrooms { get; set; }
        public List<Submission> Submissions { get; set; }
    }
}