@echo off
echo.
echo ==============================================
echo [VolunteerHub] STARTING SPRING BOOT (JAVA 21)
echo ==============================================
set JAVA_HOME=C:\Users\admin\.jdks\ms-21.0.9
set PATH=%JAVA_HOME%\bin;%PATH%
echo Using JAVA_HOME: %JAVA_HOME%
echo.

call .\mvnw.cmd spring-boot:run
echo.
pause
