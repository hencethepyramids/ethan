using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5050");

// Allow the Vite dev server (and preview) to call the API.
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:5173", "http://localhost:4173")
     .AllowAnyHeader()
     .AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

var json = new JsonSerializerOptions(JsonSerializerDefaults.Web);
var contentRoot = app.Environment.ContentRootPath;
var dataDir = Path.Combine(contentRoot, "Data");

// ── Blog posts (file-backed; swap for a DB later without touching routes) ──
List<Post> LoadPosts()
{
    var path = Path.Combine(dataDir, "posts.json");
    var text = File.ReadAllText(path);
    return JsonSerializer.Deserialize<List<Post>>(text, json) ?? new();
}

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

// List - metadata only (no body), newest first.
app.MapGet("/api/posts", () =>
{
    var posts = LoadPosts()
        .OrderByDescending(p => p.Date)
        .Select(p => new { p.Slug, p.Title, p.Date, p.Read, p.Tags, p.Excerpt });
    return Results.Ok(posts);
});

// Single - full post including body.
app.MapGet("/api/posts/{slug}", (string slug) =>
{
    var post = LoadPosts().FirstOrDefault(p => p.Slug == slug);
    return post is null ? Results.NotFound(new { error = "Post not found." }) : Results.Ok(post);
});

// Contact - validate + persist to a JSON-lines log.
app.MapPost("/api/contact", async (ContactMessage msg) =>
{
    if (string.IsNullOrWhiteSpace(msg.Name) ||
        string.IsNullOrWhiteSpace(msg.Email) ||
        string.IsNullOrWhiteSpace(msg.Message))
        return Results.BadRequest(new { error = "Name, email, and message are all required." });

    if (!msg.Email.Contains('@'))
        return Results.BadRequest(new { error = "That email doesn't look right." });

    Directory.CreateDirectory(dataDir);
    var record = new
    {
        msg.Name,
        msg.Email,
        msg.Message,
        ReceivedAt = DateTime.UtcNow.ToString("o")
    };
    await File.AppendAllTextAsync(
        Path.Combine(dataDir, "contact-messages.jsonl"),
        JsonSerializer.Serialize(record, json) + Environment.NewLine);

    return Results.Ok(new { ok = true, message = "Thanks - I'll be in touch soon." });
});

app.Run();

record ContactMessage(string Name, string Email, string Message);
record Block(string Type, string Text);
record Post(string Slug, string Title, string Date, string Read, string[] Tags, string Excerpt, Block[] Body);
