using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class Course
    {
        [Key]
        public string CourseId { get; set; }
        public string CourseName { get; set; }
        
        // Relations
        public List<Teacher> Teachers { get; set; }
        public List<Experiment> Experiments { get; set; }
        public List<Classroom> Classrooms { get; set; }
    }
}