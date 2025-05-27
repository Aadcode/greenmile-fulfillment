#!/bin/bash

# Script for installing the Greenmile fulfillment package in the main project

# Navigate to the script directory
cd "$(dirname "$0")"

# Check if the package exists
if [ ! -f "./medusa-greenmile-fulfillment-1.0.0.tgz" ]; then
    echo "Package file not found. Building the package first..."
    
    # Run the build script
    ./build-package.sh
fi

# Navigate to project root
cd "../../../"

# Install the package
echo "Installing the Greenmile fulfillment package..."
npm install "./src/modules/greenmile-fulfillment/medusa-greenmile-fulfillment-1.0.0.tgz"

echo "Package installed successfully!"
echo "You can now update your medusa-config.ts file to use the Greenmile fulfillment provider."
