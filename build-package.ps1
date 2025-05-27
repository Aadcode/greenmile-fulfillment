# PowerShell script for building and packing the package

# Navigate to the script directory
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Set-Location -Path $scriptDir

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

# Build the package
Write-Host "Building package..." -ForegroundColor Green
npm run build

# Pack the package
Write-Host "Creating npm package..." -ForegroundColor Green
npm pack

Write-Host "Package created successfully!" -ForegroundColor Green
Write-Host "You can install it in your project with:"
Write-Host "npm install <path-to>\medusa-greenmile-fulfillment-1.0.0.tgz" -ForegroundColor Cyan
