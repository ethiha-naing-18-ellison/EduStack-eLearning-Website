# Test database connection
$connectionString = "Host=localhost;Port=5432;Database=EduStackDB;Username=postgres;Password=th1234;"

try {
    # Test if we can connect to PostgreSQL
    $env:PGPASSWORD = "th1234"
    $result = psql -h localhost -p 5432 -U postgres -d EduStackDB -c "SELECT current_database(), current_user;"
    Write-Host "✅ Database connection successful!"
    Write-Host $result
    
    # Check if users table exists
    $tableCheck = psql -h localhost -p 5432 -U postgres -d EduStackDB -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users';"
    Write-Host "Users table check:"
    Write-Host $tableCheck
    
    # Check users count
    $userCount = psql -h localhost -p 5432 -U postgres -d EduStackDB -c "SELECT COUNT(*) FROM users;"
    Write-Host "Users count:"
    Write-Host $userCount
}
catch {
    Write-Host "❌ Database connection failed: $($_.Exception.Message)"
}
