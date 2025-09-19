@echo off
echo Starting KMRL Spring Boot Application...
echo.

REM Check if Java is available
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

echo Java found. Starting application...
echo.

REM Compile and run the application
javac -cp "src/main/java" src/main/java/com/kmrl/*.java src/main/java/com/kmrl/controller/*.java
if %errorlevel% neq 0 (
    echo Compilation failed. Trying alternative method...
    echo.
    
    REM Try to run with embedded dependencies
    java -Dspring.profiles.active=dev -jar target/train-induction-system-0.0.1-SNAPSHOT.jar
    if %errorlevel% neq 0 (
        echo.
        echo Alternative: Run from IDE
        echo 1. Open IntelliJ IDEA or Eclipse
        echo 2. Import this project
        echo 3. Run TrainInductionSystemApplication.java
        echo.
        pause
        exit /b 1
    )
) else (
    echo Compilation successful. Starting server...
    java -cp "src/main/java;target/classes" com.kmrl.TrainInductionSystemApplication
)

echo.
echo Application started on http://localhost:8080
echo Press Ctrl+C to stop
pause