using Microsoft.AspNetCore.Mvc;
using src.Models;

namespace src.Controllers
{
    public class TeachersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TeachersController(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}