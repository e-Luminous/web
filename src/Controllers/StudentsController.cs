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
    public class StudentsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<CustomUser> _userManager;

        public StudentsController(ApplicationDbContext context, UserManager<CustomUser> userManager)
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
        
        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.Serial == id);
        }
        
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
        
        [HttpPost]
        public async Task<JsonResult>__classrooms___(string accessCode, string sid)
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
                    try
                    {
                        var classroom = await _context.Classrooms
                            .FirstOrDefaultAsync(cls => cls.AccessCode == accessCode);
                        var student = await _context.Students
                            .SingleOrDefaultAsync(stu => stu.Account.UserId == sid);

                        if (classroom == null)
                        {
                            return Json("codeinvalid");
                        }

                        var enrollment = new StudentEnrollment
                        {
                            ClassroomId = classroom.ClassroomId,
                            StudentSerial = student.Serial,
                            EnrollmentDateTime = DateTime.Now.Date

                        };
                        _context.Add(enrollment);
                        await _context.SaveChangesAsync();
                        return Json("success");
                    }
                    catch (Exception)
                    {
                        return Json("failed");
                    }
                }
                default:
                    return Json("failed");
            }
        }
        
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