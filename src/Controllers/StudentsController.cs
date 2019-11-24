using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Models;

namespace src.Controllers
{
    public class StudentsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<CustomUser> _userManager;

        public StudentsController(ApplicationDbContext context, UserManager<CustomUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        
        /*
         * Get current user ID from cookies
         * @return Current user Identity ID
         */
        private string _getCurrentlyLoggedInUser()
        {
            return _userManager.GetUserId(HttpContext.User);
        }
        
        
        /*
         * Get current user Role (Ex: Student / Teacher)
         * @Param userId -> Login Request user ID
         * @Return Request user Role or null
         */
        private string _getAccountRoleFromUserId(string userId)
        {
            try
            {
                var acc = _context.Account.Find(userId);
                return acc.Role;
            }
            catch (Exception)
            {
                return null;
            }
        }
        
        
        /*
         * Student serial find from Student Model and return a bool
         * @Param id -> we match student serial on Students Model using ths param ID
         * @Return if we find request student info then return true or not
         */
        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.Serial == id);
        }
        
        
        /*
         * * Our Authorize Method base on a UserID *
         * This message return a string base on some condition and we decide some action base on return string
         * @Param sid -> we authorize a user using this ID and return some info
         * @Return if this is null or empty then we return Login,
         * if this tid not a student then we return Teacher string,
         * if sid is authorize then we check this id Rules then we will get some action
         */
        private string __getAuthorizationCommand(string sid)
        {
            var currentlyLoggedInUser = _getCurrentlyLoggedInUser();
            
            if (string.IsNullOrEmpty(currentlyLoggedInUser))
            {
                return "Login";
            }

            if (_getAccountRoleFromUserId(sid) != "Student")
            {
                return "Teacher";
            }

            if (sid != currentlyLoggedInUser)
            {
                return _getAccountRoleFromUserId(currentlyLoggedInUser) == "Teacher" ? "Teacher" : "Self";
            }

            return Regex.Replace(sid, @"\s+", "") == "" ? "Self" : "Continue";
        }
        
        
        /*
         * Get Request from Student Profile
         * First authenticate user, If success then Route Student Profile page 
         * @Param sid -> First we authorize user using sid, if Failed then Redirect some page OR
         * Route Student home page (Student Profile)
         * @Return Call Student/__init__ View
         */
        public async Task<IActionResult> __init__(string sid)
        {
            var currentlyLoggedInUser = _getCurrentlyLoggedInUser();
            var authCommand = __getAuthorizationCommand(sid);
            
            switch (authCommand)
            {
                case "Login":
                    return RedirectToAction("LogIn", "Account");
                case "Teacher":
                    return RedirectToAction("__init__", "Teachers", new { tid = currentlyLoggedInUser });
                case "Self":
                    await __init__(currentlyLoggedInUser);
                    break;
                case "Continue":
                {
                    var student = await _context.Students
                        .SingleOrDefaultAsync(stu => stu.Account.UserId == sid);
            
                    var institutionList = await _context.Institutions.ToListAsync();

                    foreach (var institution in institutionList)
                    {
                        student.Institutions.Add(new SelectListItem
                        {
                            Value = institution.InstitutionId,
                            Text = institution.InstitutionName
                        });
                    }

                    ViewBag.studentAccountId = sid;
                    return View(student);
                }
                default:
                    await __init__(currentlyLoggedInUser);
                    break;
            }

            return RedirectToAction("Logout", "Account");
        }
        
        
        
        /*
         * Post Request from Student Profile
         * First authenticate user, If success then Route Student Profile Edit page and Update Information
         * @Param student object -> using student object save student Update Information
         * @Return Route Student Profile page
         */
        [HttpPost]
        public async Task<IActionResult> __init__(Student student)
        {
            var currentlyLoggedInUser = _getCurrentlyLoggedInUser();
            var authCommand = __getAuthorizationCommand(currentlyLoggedInUser);
            
            switch (authCommand)
            {
                case "Login":
                    return RedirectToAction("LogIn", "Account");
                case "Teacher":
                    return RedirectToAction("__init__", "Teachers", new { tid = currentlyLoggedInUser });
                case "Self":
                    await __init__(currentlyLoggedInUser);
                    break;
                case "Continue":
                {
                    var institutionSelected =
                        await _context.Institutions.SingleOrDefaultAsync(i =>
                            i.InstitutionId == student.Institution.InstitutionId);
            
                    student.Institution = institutionSelected;
            
                    if (!ModelState.IsValid) return View(student);
            
                    try
                    {
                        _context.Update(student);
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!StudentExists(student.Serial))
                        {
                            return NotFound();
                        }
                        else
                        {
                            throw;
                        }
                    }

                    return RedirectToAction("__init__", "Students", new {sid = _getCurrentlyLoggedInUser()});
                }
                default:
                    await __init__(currentlyLoggedInUser);
                     break;
            }
            return RedirectToAction("Logout", "Account");
        }

        
        /*
         * Get Request from Student Classrooms
         * First authenticate user, If success then Route Student Classroom page 
         * @Param sid -> First we authorize user using sid, if Failed then Redirect some page OR
         * Route Student Classroom page
         * @Return Call Student/__classrooms___ View
         */
        public async Task<IActionResult>__classrooms___(string sid)
        {
            var currentlyLoggedInUser = _getCurrentlyLoggedInUser();
            var authCommand = __getAuthorizationCommand(sid);
            
             
            switch (authCommand)
            {
                case "Login":
                    return RedirectToAction("LogIn", "Account");
                case "Teacher":
                    return RedirectToAction("__classrooms___", "Teachers", new { tid = currentlyLoggedInUser });
                case "Self":
                    await __classrooms___(currentlyLoggedInUser);
                    break;
                case "Continue":
                {
                    // For Layout asp-route-tid
                    ViewBag.studentAccountId = sid;
            
                    var student = await _context.Students
                        .SingleOrDefaultAsync(stu => stu.Account.UserId == sid);
            
                    return View(student);
                }
                default:
                    await __init__(currentlyLoggedInUser);
                    break;
            }
            return RedirectToAction("Logout", "Account");
        }
        
        
        /*
         * Post Request from Student Classrooms
         * Join a classroom using classroom accessCode & Student ID
         * First authenticate user, If success then Join a Student new classroom (Pre authenticate Information)
         * @Param accessCode -> Request Join a new classroom using accessCode
         * @Param sid -> Join a new classroom on this user id
         * @Return some JSON responseData
         */
        [HttpPost]
        public async Task<JsonResult>__classrooms___(string accessCode, string sid)
        {
            var authCommand = __getAuthorizationCommand(sid);

            switch (authCommand)
            {
                case "Login":
                    return Json(new ToastErrorModel
                    {
                        ErrorMessage = "Session Dropped", ToastDescription = "Session Dropped", ToastColor = "red darken-1", ErrorContentDetails = "Null"
                    });
                case "Teacher":
                    return Json(new ToastErrorModel
                    {
                        ErrorMessage = "Invalid Role", ToastDescription = "Invalid Role Request", ToastColor = "amber darken-1", ErrorContentDetails = "Null"
                    });
                case "Self":
                    return Json(new ToastErrorModel
                    {
                        ErrorMessage = "Invalid Request", ToastDescription = "Something went wrong", ToastColor = "grey darken-1", ErrorContentDetails = "Null"
                    });
                case "Continue":
                {
                    try
                    {
                        var classroom = await _context.Classrooms
                            .Include(cls => cls.Course)
                            .Include(cls => cls.Course.Experiments)
                            .Include(cls => cls.Teacher)
                            .FirstOrDefaultAsync(cls => cls.AccessCode == accessCode);
                        
                        
                        var student = await _context.Students
                            .SingleOrDefaultAsync(stu => stu.Account.UserId == sid);

                        if (classroom == null)
                        {
                            return Json(new ToastErrorModel
                            {
                                ErrorMessage = "Invalid Request", ToastDescription = "Classroom Doesn't Exist", ToastColor = "pink darken-1", ErrorContentDetails = "Null"
                            });
                        }
                        
                        //return Json(student);
                        if (trimAndNullCheckStd(student.CollegeId) ||
                            trimAndNullCheckStd(student.HscBatch) || 
                            trimAndNullCheckStd(student.Shift))
                        {
                            return Json(new ToastErrorModel
                            {
                                ErrorMessage = "Invalid Request", ToastDescription = "Your Student Profile Is Incomplete", ToastColor = "purple darken-1", ErrorContentDetails = "Null"
                            });
                        }

                        var enrollment = new StudentEnrollment
                        {
                            ClassroomId = classroom.ClassroomId,
                            StudentSerial = student.Serial,
                            EnrollmentDateTime = DateTime.Now.Date

                        };
                        _context.Add(enrollment);

                        
                        // Initiating Submission For The Student In That Classroom While Joining
                        // Begin
                        var experimentsOfTheClassroom = classroom.Course.Experiments;
                        
                        foreach (var submission in 
                            experimentsOfTheClassroom.Select(
                                eachExperiment => new Submission {
                                SubmissionId = Guid.NewGuid().ToString().Replace("-", ""),
                                Status = "Pending",
                                Student = student,
                                Experiment = eachExperiment,
                                Classroom = classroom,
                                Teacher = classroom.Teacher
                            })){
                            _context.Add(submission);
                        }
                        // End
                        
                        
                        await _context.SaveChangesAsync();
                        return Json(new ToastErrorModel
                        {
                            ErrorMessage = "Null", ToastDescription = "Classroom Joining Successful", ToastColor = "teal darken-1", ErrorContentDetails = "Null"
                        });
                    }
                    catch (Exception e)
                    {
                        return Json(new ToastErrorModel
                        {
                            ErrorMessage = e.Message, ToastDescription = "Something Went Wrong", ToastColor = "pink darken-1", ErrorContentDetails = e.StackTrace
                        });
                    }
                }
                default:
                    return Json(new ToastErrorModel
                    {
                        ErrorMessage = "Invalid Request", ToastDescription = "Invalid Request", ToastColor = "red darken-1", ErrorContentDetails = "Null"
                    });
            }
        }

        /*
         * Trim String and check string null or empty
         * @Param str -> our checking string
         * @Return if trim string is null or empty then return true or
         * return false
         */
        private bool trimAndNullCheckStd(string str)
        {
            str = str.Trim();
            if (string.IsNullOrEmpty(str)) return true;
            return false;
        }
        
        
        /*
         * Get Request from Student Classrooms and find login Student's classroom information
         * @Param sid -> First we authorize user using sid.
         * @Return JSON responseData
         */
        public async Task<JsonResult>__getClassRoom___(string sid)
        {
            var authCommand = __getAuthorizationCommand(sid);

            switch (authCommand)
            {
                case "Login":
                    return Json("failed");
                case "Teacher":
                    return Json("failed");
                case "Self":
                    return Json("failed");
                case "Continue":
                {
                    var classroomsOfStudent =
                        await _context.StudentEnrollments
                            .Include(c => c.Student)
                            .Include(c => c.Student.Account)
                            .Include(c => c.Classroom)
                            .Include(c => c.Classroom.Teacher.Account)
                            .Where(stu => stu.Student.Account.UserId == sid)
                            .ToListAsync();
            
                        
                    return Json(classroomsOfStudent);
                }
                default:
                    return Json("failed");
            }
        }
    }
}