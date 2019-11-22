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

        
        /*
         * Get Request from Classrooms Teacher 
         * @Param tid -> login teacher id.
         * @Param cid -> login teacher's classroom id.
         * @Return just check tid & cid
         */
        [HttpGet("Classrooms/__teacher__/{tid}/{cid}")]
        public IActionResult __teacher__(string tid, string cid)
        {
            return Ok("Teacher Id: "+tid + " " +"Classroom Id: "+ cid);
        }
        
        
        [HttpGet("Classrooms/__StudentNotices__/{sid}/{cid}")]
        public IActionResult __StudentNotices__(string sid, string cid)
        {
            ViewBag.SID = sid;
            ViewBag.CID = cid;
            return View();
        }
        
        [HttpGet("Classrooms/__StudentExperiments__/{sid}/{cid}")]
        public IActionResult __StudentExperiments__(string sid, string cid)
        {
            ViewBag.SID = sid;
            ViewBag.CID = cid;
            return View();
        }
        
        [HttpGet("Classrooms/__StudentFriends__/{sid}/{cid}")]
        public IActionResult __StudentFriends__(string sid, string cid)
        {
            ViewBag.SID = sid;
            ViewBag.CID = cid;
            return View();
        }
        
    }
}