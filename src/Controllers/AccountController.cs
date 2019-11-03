using System;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using src.Data;
using src.Models;

namespace src.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<CustomUser> _userManager;
        private readonly SignInManager<CustomUser> _signInManager;

        public AccountController(ApplicationDbContext context, UserManager<CustomUser> userManager, SignInManager<CustomUser> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        
        /*
         * HttpGet : When request comes to UserAccount/Register
         * this page's View will be shown
         */
        [HttpGet]
        public IActionResult Register(string returnUrl)
        {
            ViewBag.returnUrl = returnUrl;
            return View();
        }

        /*
         * HttpGet : When request comes to UserAccount/Login
         * this page's View will be shown
         */
        [HttpGet]
        public IActionResult LogIn()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(Account account)
        {
            account.UserId = Guid.NewGuid().ToString().Replace("-", "");
            
            if (ModelState.IsValid)
            {
                var mailAddress = new MailAddress(account.UserEmail);
                account.UserName = mailAddress.User;
                
                var userObject = new CustomUser
                {
                    Id = account.UserId,
                    Email = account.UserEmail,
                    UserName = account.UserName,
                    Role = account.Role,
                    PhoneNumber = account.UserPhone,
                    LockoutEnabled = false
                };

                var userCreationResult = await _userManager.CreateAsync(userObject, account.UserPassword);

                if (userCreationResult.Succeeded)
                {
                    if (account.Role == "Teacher")
                    {
                        var teacher = new Teacher
                        {
                            Account = account
                        };
                        _context.Add(teacher);
                        _context.Add(account);
                        await _context.SaveChangesAsync();
                        await _signInManager.SignInAsync(userObject, isPersistent: false);
                        return RedirectToAction("__init__", "Teachers", new {tid = account.UserId});
                    }

                    var student = new Student
                    {
                        Account = account
                    };
                    _context.Add(student);
                    _context.Add(account);
                    await _context.SaveChangesAsync();
                    await _signInManager.SignInAsync(userObject, isPersistent: false);
                    return RedirectToAction("__init__", "Students", new {sid = account.UserId});
                }

                foreach (var error in userCreationResult.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }
            return View(account);
        }
        
        [HttpPost]
        public async Task<IActionResult> LogIn(AuthUser authUser)
        {
            return Ok(authUser);
        }
        
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
    }
}