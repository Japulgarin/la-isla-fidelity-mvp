@echo off
setlocal

cd /d "%~dp0"

if /i "%~2"=="--no-pause" set "SKIP_PAUSE=1"

if "%~1"=="" (
  set "COMMIT_MESSAGE=chore: update La Isla loyalty MVP"
) else (
  set "COMMIT_MESSAGE=%~1"
)

echo.
echo Preparing deployment...
git add -A
git diff --cached --quiet
if %errorlevel% equ 0 (
  echo No changes to deploy.
  goto :finish
)
if not %errorlevel% equ 1 (
  echo Could not check pending changes.
  goto :failed
)

git commit -m "%COMMIT_MESSAGE%"
if errorlevel 1 (
  echo Commit failed. Deployment was not started.
  goto :failed
)

git push origin main
if errorlevel 1 (
  echo Push failed. Check your GitHub login and try again.
  goto :failed
)

echo.
echo Changes uploaded. Vercel is deploying the update automatically.
echo Live site: https://la-isla-fidelity-mvp.vercel.app
:finish
echo.
if not defined SKIP_PAUSE pause
endlocal
exit /b 0

:failed
echo.
if not defined SKIP_PAUSE pause
endlocal
exit /b 1
