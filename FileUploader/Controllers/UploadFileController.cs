namespace FileUploader.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;

    [ApiController]
    [Route("api/upload")]
    public class UploadFileController : ControllerBase
    {
        private readonly ILogger<UploadFileController> _logger;

        public UploadFileController(ILogger<UploadFileController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> OnPostUploadAsync(List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    var filePath = Path.GetTempFileName();

                    using var stream = System.IO.File.Create(filePath);
                    await formFile.CopyToAsync(stream);
                }
            }

            _logger.LogInformation($"Uploaded {files.Count} files with {size} size!");

            return Ok(new { count = files.Count, size });
        }
    }
}
