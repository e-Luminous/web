using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using src.Models;

namespace src.Controllers
{
    public class TeachersController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<CustomUser> _userManager;
        public TeachersController(ApplicationDbContext context, UserManager<CustomUser> userManager)
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
         * Make a substring (Access code)
         * @Param str -> A non empty string, we make a access code using this string
         * @Return 6 digit substring from param string
         */
        private static string StringGenerator(string str)
        {
            return str.Substring(2, 6);
        }
        
        /*
         * Teacher serial find from Teacher Model and return a bool
         * @Param id -> we match teacher serial on Teacher Model using ths param ID
         * @Return if we find request teacher info then return true or not
         */
        private bool TeacherExists(int id)
        {
            return _context.Teachers.Any(e => e.Serial == id);
        }

        /*
         * * Our Authorize Method base on a UserID *
         * This message return a string base on some condition and we decide some action base on return string
         * @Param tid -> we authorize a user using this ID and return some info
         * @Return if this is null or empty then we return Login,
         * if this tid not a teacher then we return Student string,
         * if tid is authorize then we check this id Rules then we will get some action
         */
        private string __getAuthorizationCommand(string tid)
        {
            var currentlyLoggedInUser = _getCurrentlyLoggedInUser();
            
            if (string.IsNullOrEmpty(currentlyLoggedInUser))
            {
                return "Login";
            }

            if (_getAccountRoleFromUserId(tid) != "Teacher")
            {
                return "Student";
            }

            if (tid != currentlyLoggedInUser)
            {
                return _getAccountRoleFromUserId(currentlyLoggedInUser) == "Student" ? "Student" : "Self";
            }

            return Regex.Replace(tid, @"\s+", "") == "" ? "Self" : "Continue";
        }

        
        /*
         * Get Request from Teacher Profile
         * First authenticate user, If success then Route Teacher Profile page 
         * @Param tid -> First we authorize user using tid, if Failed then Redirect some page OR
         * Route teacher home page (Teacher Profile)
         * @Return Call Teacher/__init__ View
         */
        
        public async Task<IActionResult>__init__(string tid)
        {
            var currentlyLoggedInUser = _getCurrentlyLoggedInUser();
            var authCommand = __getAuthorizationCommand(tid);
            
            switch (authCommand)
            {
                case "Login":
                    return RedirectToAction("LogIn", "Account");
                case "Student":
                    return RedirectToAction("__init__", "Students", new { sid = currentlyLoggedInUser });
                case "Self":
                    await __init__(currentlyLoggedInUser);
                    break;
                case "Continue":
                {
                    var teacher = await _context.Teachers
                        .SingleOrDefaultAsync(tea => tea.Account.UserId == tid);

                    var courseList = await _context.Courses.ToListAsync();

                    foreach (var course in courseList)
                    {
                        teacher.Courses.Add(new SelectListItem
                        {
                            Value = course.CourseId,
                            Text = course.CourseName
                        });
                    }

                    var institutionList = await _context.Institutions.ToListAsync();

                    foreach (var institution in institutionList)
                    {
                        teacher.Institutions.Add(new SelectListItem
                        {
                            Value = institution.InstitutionId,
                            Text = institution.InstitutionName
                        });
                    }

                    ViewBag.teacherAccountId = tid;
                    return View(teacher);
                }
                default:
                    await __init__(currentlyLoggedInUser);
                    break;
            }

            return RedirectToAction("Logout", "Account");
        }

        
        /*
         * Post Request from Teacher Profile
         * First authenticate user, If success then Route Teacher Profile Edit page and Update Information
         * @Param teacher object -> using teacher object save teacher Update Information
         * @Return Route Teacher Profile page
         */
        [HttpPost]
        public async Task<IActionResult> __init__(Teacher teacher)
        {
            var currentlyLoggedInUser = _getCurrentlyLoggedInUser();
            var authCommand = __getAuthorizationCommand(currentlyLoggedInUser);
            
            switch (authCommand)
            {
                case "Login":
                    return RedirectToAction("LogIn", "Account");
                case "Student":
                    return RedirectToAction("__init__", "Students", new { sid = currentlyLoggedInUser });
                case "Self":
                    await __init__(currentlyLoggedInUser);
                    break;
                case "Continue":
                {
                    var courseSelected =
                        await _context.Courses.SingleOrDefaultAsync(c => c.CourseId == teacher.Course.CourseId);
                    var institutionSelected =
                        await _context.Institutions.SingleOrDefaultAsync(i =>
                            i.InstitutionId == teacher.Institution.InstitutionId);

                    teacher.Course = courseSelected;
                    teacher.Institution = institutionSelected;
            
                    if (!ModelState.IsValid) return View(teacher);
            
                    try
                    {
                        _context.Update(teacher);
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!TeacherExists(teacher.Serial))
                        {
                            return NotFound();
                        }
                        throw;
                    }

                    return RedirectToAction("__init__", "Teachers", new {tid = _getCurrentlyLoggedInUser()});
                }
                default:
                    await __init__(currentlyLoggedInUser);
                    break;
            }

            return RedirectToAction("Logout", "Account");
        }

        
        /*
         * Get Request from Teacher Classrooms
         * First authenticate user, If success then Route Teacher Classroom page 
         * @Param tid -> First we authorize user using tid, if Failed then Redirect some page OR
         * Route teacher Classroom page
         * @Return Call Teacher/__classrooms___ View
         */
        public async Task<IActionResult>__classrooms___(string tid)
        {
            var currentlyLoggedInUser = _getCurrentlyLoggedInUser();
            var authCommand = __getAuthorizationCommand(tid);
            
            switch (authCommand)
            {
                case "Login":
                    return RedirectToAction("LogIn", "Account");
                case "Student":
                    return RedirectToAction("__classrooms___", "Students", new { sid = currentlyLoggedInUser });
                case "Self":
                    await __classrooms___(currentlyLoggedInUser);
                    break;
                case "Continue":
                {
                    // For Layout asp-route-tid
                    ViewBag.teacherAccountId = tid;
            
                    var teacher = await _context.Teachers
                        .SingleOrDefaultAsync(tea => tea.Account.UserId == tid);
            
                    return View(teacher);
                }
                default:
                    await __init__(currentlyLoggedInUser);
                    break;
            }

            return RedirectToAction("Logout", "Account");
        }
        
        
        /*
         * Post Request from Teacher Classrooms
         * Create a classroom using classroom Title & teacher ID
         * First authenticate user, If success then create a Teacher new classroom (Pre authenticate Information)
         * @Param cTitle -> Request create a new classroom title
         * @Param tid -> Create a new class room on this user id
         * @Return some JSON responseData
         */
        [HttpPost]
        public async Task<JsonResult>__classrooms___(string cTitle, string tid)
        {
            var authCommand = __getAuthorizationCommand(tid);
            
            switch (authCommand)
            {
                case "Login":
                    return Json("Fail");
                case "Student":
                    return Json("Fail");
                case "Self":
                    return Json("Fail");
                case "Continue":
                {
                    try
                    {
                        var teacher = await _context.Teachers
                            .Include(tea => tea.Course)
                            .Include((tea => tea.Institution))
                            .FirstOrDefaultAsync(tea => tea.Account.UserId == tid);
                
                        if (teacher.Course == null)
                        {
                            return Json("SelectCourse");
                        }
                
                        if (trimAndNullCheckTeacher(teacher.CollegeId) || 
                            trimAndNullCheckTeacher(teacher.Shift) ||
                            teacher.Institution == null)
                        {
                            return Json("NeedCompleteTeacherProfile");
                        }
                        
                        if (cTitle == " " || cTitle == null)
                        {
                            return Json("SelectTitle");
                        }
                
                        
                        var classroomObject = new Classroom
                        {
                            ClassroomId = Guid.NewGuid().ToString().Replace("-", ""),
                            ClassroomTitle = cTitle,
                            AccessCode = StringGenerator(Guid.NewGuid().ToString().Replace("-", "")),
                            Course = teacher.Course,
                            Teacher = teacher
                        };
                        _context.Add(classroomObject);
                        await _context.SaveChangesAsync();
                        return Json("success");
              
                    }
                    catch (Exception)
                    {
                        return Json("SelectCourse");
                    }
                }
                default:
                    return Json("Fail");
            }
        }
        
        /*
         * Trim String and check string null or empty
         * @Param str -> our checking string
         * @Return if trim string is null or empty then return true or
         * return false
         */
        
        private bool trimAndNullCheckTeacher(string str)
        {
            str = str.Trim();
            if (string.IsNullOrEmpty(str)) return true;
            return false;
        }

        
        /*
         * Get Request from Teacher Classrooms and find login teacher's classroom information
         * @Param tid -> First we authorize user using tid.
         * @Return JSON responseData
         */
        public async Task<JsonResult>__getClassRoom___(string tid)
        {
            var authCommand = __getAuthorizationCommand(tid);
            
            switch (authCommand)
            {
                case "Login":
                    return Json("Fail");
                case "Student":
                    return Json("Fail");
                case "Self":
                    return Json("Fail");
                case "Continue":
                {
                    var classroomsOfTeacher =
                        await _context.Classrooms
                            .Include(c => c.Teacher)
                            .Include(c => c.Teacher.Account)
                            .Where(tec => tec.Teacher.Account.UserId == tid)
                            .ToListAsync();
            
                    return Json(classroomsOfTeacher); 
                }
                default:
                    return Json("Fail");
            }
        }
    }
}