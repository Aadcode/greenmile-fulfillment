# Using the Greenmile Fulfillment Module

This document explains how to use the `medusa-greenmile-fulfillment` package that we've created.

## Option 1: Install the Package Locally

### Step 1: Install the Package
Run the following command from your Medusa project root:

```powershell
npm install "./src/modules/greenmile-fulfillment/medusa-greenmile-fulfillment-1.0.0.tgz"
```

### Step 2: Update your Medusa Configuration
Update your `medusa-config.ts` to use the installed package:

```typescript
export default defineConfig({
  // ... other configurations
  modules: [
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "medusa-greenmile-fulfillment",
            id: "greenmile",
            options: {
              backendUrlUrl: "http://your-greenmile-service-url.com/api", 
              storeUrl:"https://mesdusaStore:9000"
              // add any other configuration options
            },
          },
        ],
      },
    },
  ]
})
```

## Option 2: Publish to NPM (for team use)

### Step 1: Create an NPM Account
If you don't have an NPM account, create one at [npmjs.com](https://www.npmjs.com/signup).

### Step 2: Login to NPM
```powershell
npm login
```

### Step 3: Publish the Package
```powershell
cd ".\src\modules\greenmile-fulfillment\"
npm publish
```

### Step 4: Install in Your Project
```powershell
npm install medusa-greenmile-fulfillment
```

## Option 3: Use as a Private Package

### Step 1: Setup a Private NPM Registry
You can use services like GitHub Packages, GitLab Package Registry, or set up your own private NPM registry.

### Step 2: Configure NPM to use your Private Registry
```powershell
npm config set @your-scope:registry https://your-private-registry-url
```

### Step 3: Publish to Your Private Registry
```powershell
cd ".\src\modules\greenmile-fulfillment\"
npm publish --registry=https://your-private-registry-url
```

### Step 4: Install from Your Private Registry
```powershell
npm install @your-scope/medusa-greenmile-fulfillment
```

## Testing the Integration

After installing the package, you can test it by:

1. Starting your Medusa server:
   ```powershell
   npm run dev
   ```

2. Checking the server logs to ensure there are no errors related to the fulfillment provider.

3. Creating a shipping option in the Medusa admin panel that uses the Greenmile fulfillment provider.

4. Testing a checkout flow that uses the Greenmile shipping option.
