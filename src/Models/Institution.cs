using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace src.Models
{
    public class Institution
    {
        [Key]
        public string InstitutionId { get; set; }
        public string InstitutionName { get; set; }
        public string InstitutionLocation { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        [DataType(DataType.Date)]
        public DateTime Established { get; set; }
        
        // Relations
        // Each Institution Can Have Multiple Students and Teachers
        public List<Student> Students { get; set; }
        public List<Teacher> Teachers { get; set; }
    }
}