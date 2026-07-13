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
        .Select(p => new { p.Slug, p.Title, p.Date, p.Read, p.Tags, p.Excerpt, p.Url, p.Source });
    return Results.Ok(posts);
});

// Single - full post including body.
app.MapGet("/api/posts/{slug}", (string slug) =>
{
    var post = LoadPosts().FirstOrDefault(p => p.Slug == slug);
    return post is null ? Results.NotFound(new { error = "Post not found." }) : Results.Ok(post);
});

app.Run();

record Block(string Type, string Text);
// Native posts have a Body and Read time; external posts (published on
// another site) have a Url and Source instead.
record Post(string Slug, string Title, string Date, string[] Tags, string Excerpt,
    string? Read = null, Block[]? Body = null, string? Url = null, string? Source = null);
