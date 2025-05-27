#!/bin/bash

# Build and pack the package
echo "Building and packing the Greenmile Fulfillment package..."

# Navigate to the package directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the package
echo "Building package..."
npm run build

# Pack the package
echo "Creating npm package..."
npm pack

echo "Package created successfully!"
echo "You can install it in your project with:"
echo "npm install /path/to/medusa-greenmile-fulfillment-1.0.0.tgz"
