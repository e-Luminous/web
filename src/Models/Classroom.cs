using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class Classroom
    {
        [Key]
        public string ClassroomId { get; set; }

        public string ClassroomTitle { get; set; }
        
        public string AccessCode { get; set; }

        //Relations
        
        public Course Course { get; set; }
        public Teacher Teacher { get; set; }
        
        public List<StudentEnrollment> StudentEnrollments { get; set; }
        public List<Submission> Submissions { get; set; }
    }
}