
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class Experiment
    {
        [Key]
        public string ExperimentId { get; set; }
        public string ExperimentName { get; set; }
        
        //Relations 
        public Course Course { get; set; }
        public List<Submission> Submissions { get; set; }
    }
}