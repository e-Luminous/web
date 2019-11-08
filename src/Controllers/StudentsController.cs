using System;
using System.CodeDom.Compiler;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ValueGeneration.Internal;
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
            catch (Exception e)
            {
                return null;
            }
        }
        
        
        public async Task<IActionResult> __init__(string sid)
        {
            if (_getCurrentlyLoggedInUser() == "" || _getCurrentlyLoggedInUser() == null)
            {
                return RedirectToAction("LogIn", "Account");
            }
            
            if (_getAccountRoleFromUserId(sid) != "Student")
            {
                return RedirectToAction("__init__", "Teachers", new { tid = _getCurrentlyLoggedInUser() });
            }

            if (sid != _getCurrentlyLoggedInUser() || sid == null || Regex.Replace(sid, @"\s+", "") == "")
            {
                await __init__(_getCurrentlyLoggedInUser());
            }

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
        
        [HttpPost]
        public async Task<IActionResult> __init__(Student student)
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

            return RedirectToAction("__init__", "Students", new {tid = _getCurrentlyLoggedInUser()});
        }

        public async Task<IActionResult>__classrooms___(string sid)
        {
            if (_getCurrentlyLoggedInUser() == "" || _getCurrentlyLoggedInUser() == null)
            {
                return RedirectToAction("LogIn", "Account");
            }
            
            if (_getAccountRoleFromUserId(sid) != "Student")
            {
                return RedirectToAction("__init__", "Teachers", new { tid = _getCurrentlyLoggedInUser() });
            }

            if (sid != _getCurrentlyLoggedInUser() || sid == null || Regex.Replace(sid, @"\s+", "") == "")
            {
                await __init__(_getCurrentlyLoggedInUser());
            }
            
            // For Layout asp-route-tid
            ViewBag.studentAccountId = sid;
            
            var student = await _context.Students
                .SingleOrDefaultAsync(stu => stu.Account.UserId == sid);
            
            return View(student);
        }
        
        [HttpPost]
        public async Task<IActionResult>__classrooms___(string accessCode, string sid)
        {
            
            if (_getCurrentlyLoggedInUser() == "" || _getCurrentlyLoggedInUser() == null)
            {
                return RedirectToAction("LogIn", "Account");
            }
            
            if (_getAccountRoleFromUserId(sid) != "Student")
            {
                return RedirectToAction("__init__", "Teachers", new { tid = _getCurrentlyLoggedInUser() });
            }

            if (sid != _getCurrentlyLoggedInUser() || sid == null || Regex.Replace(sid, @"\s+", "") == "")
            {
                await __init__(_getCurrentlyLoggedInUser());
            }

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
            catch (Exception e)
            {
                return Json("failed");
                
            }
            
        }
        
        public async Task<JsonResult>__getClassRoom___(string sid)
        {
            var classroomsOfStudent =
                await _context.StudentEnrollments
                    .Include(c => c.Student)
                    .Include(c => c.Student.Account)
                    .Include(c => c.Classroom)
                    .Where(tec => tec.Student.Account.UserId == sid)
                    .ToListAsync();
            
                        
            return Json(classroomsOfStudent);
        }
        
        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.Serial == id);
        }
    }
}