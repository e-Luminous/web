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
            catch (Exception e)
            {
                return null;
            }
        }
        
        public async Task<IActionResult>__init__(string tid)
        {
            if (_getCurrentlyLoggedInUser() == "" || _getCurrentlyLoggedInUser() == null)
            {
                return RedirectToAction("LogIn", "Account");
            }
            
            if (_getAccountRoleFromUserId(tid) != "Teacher")
            {
                return RedirectToAction("__init__", "Students", new { sid = _getCurrentlyLoggedInUser() });
            }

            if (tid != _getCurrentlyLoggedInUser() || tid == null || Regex.Replace(tid, @"\s+", "") == "")
            {
                await __init__(_getCurrentlyLoggedInUser());
            }

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
        
        [HttpPost]
        public async Task<IActionResult> __init__(Teacher teacher)
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
                else
                {
                    throw;
                }
            }

            await __init__(_getCurrentlyLoggedInUser());
            return View(teacher);
        }

        public async Task<IActionResult>__classrooms___(string tid)
        {
            if (_getCurrentlyLoggedInUser() == "" || _getCurrentlyLoggedInUser() == null)
            {
                return RedirectToAction("LogIn", "Account");
            }
            
            if (_getAccountRoleFromUserId(tid) != "Teacher")
            {
                return RedirectToAction("__init__", "Students", new { sid = _getCurrentlyLoggedInUser() });
            }

            if (tid != _getCurrentlyLoggedInUser() || tid == null || Regex.Replace(tid, @"\s+", "") == "")
            {
                await __classrooms___(_getCurrentlyLoggedInUser());
            }
            
            ViewBag.teacherAccountId = tid;
            
            return View();
        }
        
        private bool TeacherExists(int id)
        {
            return _context.Teachers.Any(e => e.Serial == id);
        }
    }
}