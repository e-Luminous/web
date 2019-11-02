using System;
using System.Collections.Generic;
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
        public List<Submission> Submissions { get; set; }
        public List<StudentEnrollment> StudentEnrollments { get; set; }
        public Institution Institution { get; set; }
    }
}