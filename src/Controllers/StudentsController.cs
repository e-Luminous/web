using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
            
            return View(student);
        }
    }
}