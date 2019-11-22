
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class Experiment
    {
        [Key]
        public string ExperimentId { get; set; }
        public string ExperimentName { get; set; }
        
        /**************************************
         * Extending features
         * prior to override described in doc
         **************************************/
        [DataType(DataType.Html)]
        public string ExperimentTableHeaderMarkUp { get; set; }

        [DataType(DataType.Html)]
        public string ExperimentalTableBodyMarkUp { get; set; }
        
        [DataType(DataType.MultilineText)]
        public string ExperimentalTableJsonStructure { get; set; }
        
        //Relations 
        public Course Course { get; set; }
        public List<Submission> Submissions { get; set; }
    }
}