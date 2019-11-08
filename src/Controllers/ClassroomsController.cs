using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("Classrooms/__teacher__/{tid}/{cid}")]
        public async Task<IActionResult> __teacher__(string tid, string cid)
        {
            return Ok(tid + " " + cid);
        }
        
        [HttpGet("Classrooms/__student__/{sid}/{cid}")]
        public async Task<IActionResult> __student__(string sid, string cid)
        {
            return Ok(sid + " " + cid);
        }

        
    }
}