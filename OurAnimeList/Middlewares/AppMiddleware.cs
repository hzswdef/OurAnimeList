using OurAnimeList.Auth;

namespace OurAnimeList.Middlewares;

public class AppMiddleware(
    ILogger<AppMiddleware> logger,
    RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, CurrentUserService currentUserService)
    {
        // Prevent app indexing by search engines.
        // @see https://developers.google.com/search/docs/crawling-indexing/block-indexing
        context.Response.Headers.Append("X-Robots-Tag", "noindex");
        
        logger.LogInformation(
            "{} {}: {}",
            context.Response.StatusCode,
            context.Request.Method,
            context.Request.Path);
        
        await next(context);
    }
}