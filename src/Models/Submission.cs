using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace src.Models
{
    public class Submission
    {
        [Key]
        public string SubmissionId { get; set; }
        public string ApiData { get; set; }
        public float MarksGiven { get; set; }
        public float MarksScale { get; set; }
        public string Status { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime LastUpdated { get; set; }

        public float QualityRatio { get; set; }

        public string QualityStatus { get; set; }

        //Relations 
        public Student Student { get; set; }
        public Experiment Experiment { get; set; }
        public Classroom Classroom { get; set; }
        public Teacher Teacher { get; set; }
    }
}