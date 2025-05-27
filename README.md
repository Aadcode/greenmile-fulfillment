# Medusa Greenmile Fulfillment Provider

A fulfillment provider plugin for the [Medusa Commerce](https://medusajs.com/) platform that integrates with Greenmile shipping services.

## Features

- Multiple shipping options (standard, express, same-day, next-day)
- Dynamic shipping rate calculation based on destination, origin, and package details
- Integration with Greenmile API for shipping rate calculation
- Support for creating and managing fulfillments

## Installation

```bash
npm install medusa-greenmile-fulfillment
```

Or using yarn:

```bash
yarn add medusa-greenmile-fulfillment
```

## Configuration

Add this to your `medusa-config.js` or `medusa-config.ts` file:

```typescript
module.exports = {
  // ... other configuration
  modules: [
    // ... other modules
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          // ... other providers
          {
            resolve: "medusa-greenmile-fulfillment",
            id: "greenmile",
            options: {
              // Configure your Greenmile API settings here
              backendUrl: "https://your-greenmile-api-url.com", 
              storeUrl:"https://mesdusaStore:9000"
              // other options...
            },
          },
        ],
      },
    },
  ],
};
```

## Usage

Once configured, the Greenmile fulfillment provider will be available in your Medusa store. The following shipping options will be available:

- Standard shipping
- Express shipping
- Same-day shipping
- Next-day shipping

## API Endpoints

The plugin expects your Greenmile API to have the following endpoint:

- `POST /calculate_rate/` - Calculates shipping rates based on destination, origin, and package details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
