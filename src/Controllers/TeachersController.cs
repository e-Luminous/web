using System;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        
        public IActionResult __init__(string tid)
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
                __init__(_getCurrentlyLoggedInUser());
            }
            
            ViewBag.id = tid;
            return View();
        }
    }
}