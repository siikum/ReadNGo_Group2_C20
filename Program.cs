using Microsoft.EntityFrameworkCore;
using ReadNGo.Services.Interfaces;
using ReadNGo.Services.Implementations;
using ReadNGo.DBContext;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register your services for Dependency Injection
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// Configure PostgreSQL connection
builder.Services.AddDbContext<ReadNGoContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // shows stack traces
    app.UseSwagger();
    app.UseSwaggerUI(); // shows the Swagger UI
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

