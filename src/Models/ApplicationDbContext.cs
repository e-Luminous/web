using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using src.Models;

namespace src.Models
{
    public class ApplicationDbContext : IdentityDbContext<CustomUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Experiment> Experiments { get; set; }
        public DbSet<Institution> Institutions { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<StudentEnrollment> StudentEnrollments { get; set; }
        public DbSet<Account> Account { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            builder.Entity<StudentEnrollment>().HasKey(sc => new
            {
                sc.StudentSerial,
                sc.ClassroomId
            });

            builder.Entity<StudentEnrollment>()
                .HasOne(stu => stu.Student)
                .WithMany(enr => enr.StudentEnrollments)
                .HasForeignKey(f => f.StudentSerial);
            
            builder.Entity<StudentEnrollment>()
                .HasOne(cls => cls.Classroom)
                .WithMany(enr => enr.StudentEnrollments)
                .HasForeignKey(f => f.ClassroomId);
        }
    }
}