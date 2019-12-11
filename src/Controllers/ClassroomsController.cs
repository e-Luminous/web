using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Models;

namespace src.Controllers
{
    public class ClassroomsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<CustomUser> _userManager;
        private readonly SignInManager<CustomUser> _signInManager;

        public ClassroomsController(ApplicationDbContext context, UserManager<CustomUser> userManager, SignInManager<CustomUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        
        /*
         * Get Request from Classrooms Teacher 
         * @Param tid -> login teacher id.
         * @Param cid -> login teacher's classroom id.
         * @Return just check tid & cid
         */
        
        [HttpGet("Classrooms/__StudentNotices__/{sid}/{cid}")]
        public IActionResult __StudentNotices__(string sid, string cid)
        {
            var stdSubmissionInfo = _context
                .Submissions
                .Include(sub => sub.Experiment)
                .Where(std => std.Student.Account.UserId == sid)
                .ToList();

            ViewBag.SID = sid;
            ViewBag.CID = cid;
            return View(stdSubmissionInfo);
        }
        
        [HttpGet("Classrooms/__StudentExperiments__/{sid}/{cid}")]
        public async Task<IActionResult>__StudentExperiments__(string sid, string cid)
        {
            var classroomInformationAsync = await _context
                                            .Classrooms
                                            .Include(cls => cls.Course)
                                            .SingleOrDefaultAsync(cls => cls.ClassroomId == cid);
            
            ViewBag.SID = sid;
            ViewBag.CID = cid;
            return View(classroomInformationAsync.Course);
        }
        
        [HttpGet("Classrooms/__StudentExperimentsForTeacher__/{tid}/{cid}")]
        public async Task<IActionResult>__StudentExperimentsForTeacher__(string tid, string cid)
        {
            var classroomInformationAsync = await _context
                .Classrooms
                .Include(cls => cls.Course)
                .SingleOrDefaultAsync(cls => cls.ClassroomId == cid);
            
            ViewBag.TID = tid;
            ViewBag.CID = cid;
            return View(classroomInformationAsync.Course);
        }
        
        [HttpGet("Classrooms/__StudentFriends__/{sid}/{cid}")]
        public IActionResult __StudentFriends__(string sid, string cid)
        {
            var enrollments = _context.StudentEnrollments.Include(sub => sub.Student)
                .Include(stu => stu.Student.Account)
                .Include(stu => stu.Student.Institution)
                .Where(cls => cls.ClassroomId == cid)
                .ToList();
            var students = enrollments.Select(eachEnrollment => eachEnrollment.Student).ToList();
            
            ViewBag.SID = sid;
            ViewBag.CID = cid;
            return View(students);
        }
        
        [HttpGet("Classrooms/__StudentList__/{tid}/{cid}")]
        public IActionResult __StudentList__(string tid, string cid)
        {
            var enrollments = _context.StudentEnrollments.Include(sub => sub.Student)
                .Include(stu => stu.Student.Account)
                .Include(stu => stu.Student.Institution)
                .Where(cls => cls.ClassroomId == cid)
                .ToList();

            var students = enrollments.Select(eachEnrollment => eachEnrollment.Student).ToList();

            ViewBag.TID = tid;
            ViewBag.CID = cid;
            return View(students);
        }
        
        /** API **/
        
        public async Task<JsonResult> GetPhysicsSubmissionOfTheStudent(string studentId, string classroomId)
        {
            try
            {
                var allSubmissionsOfTheStudentInTheClassroomAsync = await _context
                                                    .Submissions
                                                    .Include(sub => sub.Experiment)
                                                    .Where(submission => submission.Student.Account.UserId == studentId)
                                                    .Where(submission => submission.Classroom.ClassroomId == classroomId)
                                                    .ToListAsync();
                return Json(allSubmissionsOfTheStudentInTheClassroomAsync);
            }
            catch (Exception e)
            {
                return Json(new ToastErrorModel
                {
                    ErrorMessage = "Something Went Wrong",
                    ToastColor = "red darken-1",
                    ToastDescription = e.Message,
                    ErrorContentDetails = e.StackTrace
                });
            }
        }
        
        public async Task<JsonResult> PostPhysicsSubmissionOfTheStudent(string statusNow, string postJsonPhy, string submissionId, float qualityRatio, string qualityStatus)
        {
            try
            {
                var submissionObj = new Submission
                {
                    Status = statusNow, 
                    SubmissionId = submissionId,
                    LastUpdated = DateTime.Now,
                    ApiData = postJsonPhy,
                    QualityRatio = qualityRatio,
                    QualityStatus = qualityStatus
                };
                _context.Update(submissionObj);
                await _context.SaveChangesAsync();
                return Json("success");
            }
            catch (Exception e)
            {
                return Json(new ToastErrorModel
                {
                    ErrorMessage = "Something Went Wrong",
                    ToastColor = "red darken-1",
                    ToastDescription = e.Message,
                    ErrorContentDetails = e.StackTrace
                });
            }
        }

        public async Task<JsonResult> GetPhysicsSubmissionOfTheTeacher(string classroomId)
        {
            try
            {
                var allSubmissionsOfTheTeacherInTheClassroomAsync = await _context
                    .Submissions
                    .Include(exp => exp.Experiment)
                    .Include(std => std.Student)
                    .Where(submission => submission.Classroom.ClassroomId == classroomId)
                    .ToListAsync();
                
                return Json(allSubmissionsOfTheTeacherInTheClassroomAsync);
            }
            catch (Exception e)
            {
                return Json(new ToastErrorModel
                {
                    ErrorMessage = "Something Went Wrong",
                    ToastColor = "red darken-1",
                    ToastDescription = e.Message,
                    ErrorContentDetails = e.StackTrace
                });
            }
        }
        
        public async Task<JsonResult> PostPhysicsSubmissionOfTheTeacher(List<Submission> allSubmissions)
        {
            try
            {
                foreach (var eachSubmission in allSubmissions)
                {
                    var submission = _context.Submissions.SingleOrDefault(su =>
                        su.SubmissionId == eachSubmission.SubmissionId);

                    if (submission != null)
                    {
                        submission.MarksGiven = eachSubmission.MarksGiven;
                        _context.Update(submission);
                    }
                }
                await _context.SaveChangesAsync();
                return Json("success");
            }
            catch (Exception e)
            {
                return Json(new ToastErrorModel
                {
                    ErrorMessage = "Something Went Wrong",
                    ToastColor = "red darken-1",
                    ToastDescription = e.Message,
                    ErrorContentDetails = e.StackTrace
                });
            }
        }
    }
}