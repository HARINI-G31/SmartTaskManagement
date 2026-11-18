using SmartTaskManagement.Common;

namespace SmartTaskManagement.Middleware;

public class ExceptionHandlingMiddleware(
    RequestDelegate next, //next middleware in the pipeline to be invoked after this middleware has completed its processing
    ILogger<ExceptionHandlingMiddleware> logger) //ILogger stores log messages for the ExceptionHandlingMiddleware class, which can be used for debugging and monitoring purposes
{
    public async Task InvokeAsync(HttpContext context) //HttpContext represents the context of the current HTTP request, including information about the request and response, as well as any middleware that has been executed so far
    {
        try
        {
            await next(context);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            logger.LogInformation(
                "Request {Method} {Path} was canceled by the client.",
                context.Request.Method, //rcords log message method and path of the request
                context.Request.Path); 

            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = 499; //499 is a commonly used, non-standard HTTP status code meaning the client closed the request.
            }
        }
        catch (OperationCanceledException exception)
        {
            logger.LogWarning(
                exception,
                "Request {Method} {Path} timed out or was canceled.",
                context.Request.Method,
                context.Request.Path);

            await WriteErrorResponseAsync(context, StatusCodes.Status408RequestTimeout, "The request was canceled or timed out.");
        }
        catch (Exception exception)
        {
            logger.LogError(
                exception,
                "Unhandled exception while processing {Method} {Path}.",
                context.Request.Method,
                context.Request.Path);

            await WriteErrorResponseAsync(context, StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    private static async Task WriteErrorResponseAsync(HttpContext context, int statusCode, string message)
    {
        if (context.Response.HasStarted)
        {
            return;
        }

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new ApiResponse<object?> //This converts your ApiResponse object into JSON and sends it to the client.
        {
            Success = false,
            Message = message,
            Data = null
        };

        await context.Response.WriteAsJsonAsync(response, CancellationToken.None); //CancellationToken.None means this particular response-writing operation is not canceled using the request's cancellation token
    }
}
