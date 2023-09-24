using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    public class YourController : Controller
    {
        private readonly ILogger<YourController> _logger;

        public YourController(ILogger<YourController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            // Your logic here

            return View();
        }

    [   HttpPost("/processlogin")]
        public IActionResult ProcessLogin()
        {
            // Your logic here

            return Json(credentials);
        }

        [HttpPost("/processnewuser")]
        public IActionResult ProcessNewUser()
        {
            // Your logic here

            return Json(credentials);
        }

        [HttpGet("/logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("email");
            return Redirect("/");
        }

        // Custom login_required attribute
        public IActionResult SecureFunction()
        {
            if (!HttpContext.Session.Keys.Contains("email"))
            {
                return Redirect("/login?next=" + Request.Path);
            }
            return View();
        }

        private readonly IHubContext<ChatHub> _chatHubContext;

        public YourController(IHubContext<ChatHub> chatHubContext)
        {
            _chatHubContext = chatHubContext;
        }

        [HttpGet("/chat")]
        [LoginRequired] // Custom login_required attribute
        public IActionResult Chat()
        {
            return View();
        }

        [HubName("chat")]
        public class ChatHub : Hub
        {
            public async Task Joined(Message message)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "main");
                await Clients.Group("main").SendAsync("status", new { msg = GetUser() + " has entered the room.", style = "width: 100%;color:blue;text-align: right" });
            }

            public async Task Left(Message message)
            {
                await Clients.Group("main").SendAsync("left", new { msg = GetUser() + " has left the room.", style = "width: 100%;color:blue;text-align: right" });
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, "main");
            }
        }

        [HttpGet("/boards")]
        [LoginRequired] // Custom login_required attribute
        public IActionResult Boards()
        {
            return View();
        }

        [HubName("boardchat")]
        public class BoardChatHub : Hub
        {
            public async Task Joined(Message message)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "main");
                await Clients.Group("main").SendAsync("status", new { msg = GetUser() + " has entered the room.", style = "width: 100%;color:blue;text-align: right" });
            }

            public async Task Message(Data data)
            {
                await Clients.Group("main").SendAsync("status", new { msg = data.Message, style = "width: 100%;color:blue;text-align: right" });
            }

            public async Task Update(Data data)
            {
                await Clients.Group("main").SendAsync("update_board", new { msg = data.Update.Trim() + ">" + data.CardNumber, style = "width: 100%;color:blue;text-align: right" });
            }
        }
               [HttpGet("/")]
        public IActionResult Root()
        {
            return RedirectToAction("Home");
        }

        [HttpGet("/home")]
        public IActionResult Home()
        {
            string[] funFacts = {
                "I opened an ecommerce store in the summer of 2019.",
                "I have a golden retriever and an English shepherd.",
                "I'm a songwriter and musician.",
                "I am learning to play the electric guitar"
            };
            string funFact = funFacts[new Random().Next(0, funFacts.Length)];
            return View("Home", new { user = GetUser(), fun_fact = funFact });
        }

        [HttpGet("/resume")]
        public IActionResult Resume()
        {
            var resumeData = db.GetResumeData();
            return View("Resume", new { user = GetUser(), resume_data = resumeData });
        }

        [HttpGet("/projects")]
        public IActionResult Projects()
        {
            return View("Projects", new { user = GetUser() });
        }

        [HttpGet("/piano")]
        public IActionResult Piano()
        {
            return View("Piano", new { user = GetUser() });
        }

        [HttpPost("/processfeedback")]
        public IActionResult ProcessFeedback(Feedback feedback)
        {
            db.InsertRows("feedback", new[] { "name", "email", "comment" }, new[] { feedback.Name, feedback.Email, feedback.Comment });
            var feedbackStructure = db.ProcessFeedback();
            return View("ProcessFeedback", new { feedback_structure = feedbackStructure });
        }

        [HttpGet("/after_request")]
        public IActionResult AfterRequest()
        {
            HttpContext.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0";
            HttpContext.Response.Headers["Pragma"] = "no-cache";
            HttpContext.Response.Headers["Expires"] = "0";
            return View();
        }


        // Helper method
        public string GetUser()
        {
            return HttpContext.Session.Keys.Contains("email") ? db.ReversibleEncrypt("decrypt", HttpContext.Session.GetString("email")) : "Unknown";
        }

    }    // Add other action methods as needed
}   