using System;
using Microsoft.EntityFrameworkCore;
using Npgsql;

class Program
{
    static void Main()
    {
        string connectionString = "Host=localhost;Port=5432;Database=EduStackDB;Username=postgres;Password=th1234;";
        
        try
        {
            using var connection = new NpgsqlConnection(connectionString);
            connection.Open();
            Console.WriteLine("✅ Database connection successful!");
            Console.WriteLine($"Database: {connection.Database}");
            Console.WriteLine($"Server Version: {connection.ServerVersion}");
            
            // Test if we can create a simple table
            using var command = new NpgsqlCommand("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users'", connection);
            var tableExists = (long)command.ExecuteScalar();
            Console.WriteLine($"Users table exists: {tableExists > 0}");
            
            if (tableExists > 0)
            {
                using var countCommand = new NpgsqlCommand("SELECT COUNT(*) FROM users", connection);
                var userCount = (long)countCommand.ExecuteScalar();
                Console.WriteLine($"Users in database: {userCount}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Database connection failed: {ex.Message}");
        }
    }
}
