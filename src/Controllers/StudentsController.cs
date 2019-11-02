using Microsoft.AspNetCore.Mvc;
using src.Models;

namespace src.Controllers
{
    public class StudentsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}