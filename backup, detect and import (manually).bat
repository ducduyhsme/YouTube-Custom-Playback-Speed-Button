@echo off

REM === Description ===
REM This script backs up Tampermonkey data for Chrome-based browsers.
REM It allows you to manually enter the backup destination directory.
REM If the backup contains more than 1 file, it creates a new date-stamped folder for the backup.
REM After backup is complete, it instantly detects and imports the latest backup in the chosen directory.

REM === Configuration ===
set "BROWSER=Chrome"
set "CHROME_USER_DATA=%LOCALAPPDATA%\Google\Chrome\User Data\Default"
REM Tampermonkey extension ID for Chrome
set "TM_ID=dhdgffkkebhmkfjojejmpbldmpobfkfo"

REM === [ADDED] Prompt user for backup destination directory ===
set /p BACKUP_DIR=Enter backup destination directory (e.g. D:\Backup): 

REM === Create backup folder with current date ===
for /f "tokens=2 delims==." %%I in ('"wmic os get localdatetime /value"') do set datetime=%%I
set "DATE=%datetime:~0,8%_%datetime:~8,6%"
set "DEST=%BACKUP_DIR%\Backup_%DATE%"

REM === Source Tampermonkey folder ===
set "SRC=%CHROME_USER_DATA%\Extensions\%TM_ID%"

REM === Start backup ===
echo Backing up Tampermonkey data from:
echo   %SRC%
echo to:
echo   %BACKUP_DIR%
echo.

if not exist "%SRC%" (
    echo Source folder not found! Make sure the browser profile path and extension ID are correct.
    pause
    exit /b 1
)

REM Count number of files in the source directory
set FILECOUNT=0
for /r "%SRC%" %%F in (*) do set /a FILECOUNT+=1

REM Decide backup destination (folder or just copy if 1 file)
if %FILECOUNT% GTR 1 (
    if not exist "%DEST%" mkdir "%DEST%"
    xcopy "%SRC%" "%DEST%\" /e /i /y
    echo Backup complete! Data saved to folder: %DEST%
) else (
    if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
    for %%F in ("%SRC%\*") do copy "%%F" "%BACKUP_DIR%\" /y
    echo Backup complete! Data saved to: %BACKUP_DIR%
)

REM === Automatically detect and import the latest Tampermonkey backup in the chosen directory ===

REM Find the most recent backup folder matching Backup_???????_??????
set "LATEST_BACKUP="
for /f "delims=" %%D in ('dir "%BACKUP_DIR%\Backup_????????_??????" /ad /b /o-d 2^>nul') do (
    set "LATEST_BACKUP=%%D"
    goto :found
)

echo No backup folder found in %BACKUP_DIR% matching Backup_????????_??????.
pause
exit /b 1

:found
echo Latest backup folder detected: %LATEST_BACKUP%

REM === Import procedure ===
REM Replace the following line with your actual import logic.
REM Example: echo Importing from "%BACKUP_DIR%\%LATEST_BACKUP%"
echo Importing backup from: "%BACKUP_DIR%\%LATEST_BACKUP%"
REM your_import_command "%BACKUP_DIR%\%LATEST_BACKUP%"

pause