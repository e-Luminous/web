using System;
using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class StudentEnrollment
    {
        public int StudentSerial { get; set; }
        public Student Student { get; set; }

        public string ClassroomId { get; set; }
        public Classroom Classroom { get; set; }
        
        [DataType(DataType.DateTime)]
        public DateTime EnrollmentDateTime { get; set; }
    }
}