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
        
        private string _getCurrentlyLoggedInUser()
        {
            return _userManager.GetUserId(HttpContext.User);
        }

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
        
        private static string StringGenerator(string str)
        {
            return str.Substring(2, 6);
        }
        private bool TeacherExists(int id)
        {
            return _context.Teachers.Any(e => e.Serial == id);
        }

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