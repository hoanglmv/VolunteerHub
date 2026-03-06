$env:JAVA_HOME="C:\Users\admin\.jdks\ms-21.0.9"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
Write-Host "Using JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green
.\mvnw clean compile -DskipTests
