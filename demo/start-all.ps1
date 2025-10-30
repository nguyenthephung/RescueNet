Write-Host "Starting RescueNet Services..." -ForegroundColor Green
Write-Host ""

# Check Neo4j
Write-Host "Checking Neo4j..." -ForegroundColor Yellow
$neo4jRunning = docker ps --filter "name=rescuenet-neo4j" --filter "status=running" -q
if ($neo4jRunning) {
    Write-Host "Neo4j is running" -ForegroundColor Green
} else {
    Write-Host "Starting Neo4j..." -ForegroundColor Yellow
    docker run -d --name rescuenet-neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/12345678 neo4j:5.12-community
    Write-Host "Neo4j started at http://localhost:7474" -ForegroundColor Green
}
Write-Host ""

# Start Auth Service
Write-Host "Starting Auth Service (Port 8080)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/c", "run-auth.bat"
Start-Sleep -Seconds 3

# Start Profile Service
Write-Host "Starting Profile Service (Port 8081)..." -ForegroundColor Magenta
Start-Process cmd -ArgumentList "/c", "run-profile.bat"
Start-Sleep -Seconds 3

# Start API Gateway
Write-Host "Starting API Gateway (Port 8888)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/c", "run-gateway.bat"

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:"
Write-Host "  Auth Service:    http://localhost:8080/auth"
Write-Host "  Profile Service: http://localhost:8081/profile"
Write-Host "  API Gateway:     http://localhost:8888"
Write-Host "  Neo4j Browser:   http://localhost:7474"
Write-Host ""
Write-Host "Wait 30-60 seconds for services to start..."
Write-Host ""
Write-Host "Test: curl http://localhost:8888/api/v1/auth/introspect"
Write-Host ""
