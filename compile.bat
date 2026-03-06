@echo off
echo.
echo ==============================================
echo [VolunteerHub] COMPILING THE PROJECT (JAVA 21)
echo ==============================================
set JAVA_HOME=C:\Users\admin\.jdks\ms-21.0.9
set PATH=%JAVA_HOME%\bin;%PATH%
echo Using JAVA_HOME: %JAVA_HOME%
echo.

call .\mvnw.cmd clean compile
echo.
pause
