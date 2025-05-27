# PowerShell script for installing the Greenmile fulfillment package in the main project

# Navigate to the script directory
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Set-Location -Path $scriptDir

# Check if the package exists
if (-not (Test-Path -Path "./medusa-greenmile-fulfillment-1.0.0.tgz")) {
    Write-Host "Package file not found. Building the package first..." -ForegroundColor Yellow
    
    # Run the build script
    ./build-package.ps1
}

# Navigate to project root
Set-Location -Path "../../../"

# Install the package
Write-Host "Installing the Greenmile fulfillment package..." -ForegroundColor Green
npm install "./src/modules/greenmile-fulfillment/medusa-greenmile-fulfillment-1.0.0.tgz"

Write-Host "Package installed successfully!" -ForegroundColor Green
Write-Host "You can now update your medusa-config.ts file to use the Greenmile fulfillment provider." -ForegroundColor Cyan
