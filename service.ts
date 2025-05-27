import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";
import axios from "axios";
import {
  CalculateShippingOptionPriceDTO,
  CalculatedShippingOptionPrice,
  CreateFulfillmentResult,
  FulfillmentItemDTO,
  FulfillmentOrderDTO,
  FulfillmentDTO,
} from "@medusajs/framework/types"

// Define our own type declaration
declare type CreateShippingOptionDTO = {
  shipping_address?: any;
  items?: any[];
  [key: string]: any;
};



class GreenmileFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "greenmile";

  options_: any;
  greenmileBaseUrl: string;

  private static readonly VALID_OPTIONS = [
    "standard",
    "express",
    "sameday",
    "nextday",
  ]

  constructor(options: any) {
    super();
    this.options_ = options;
    this.greenmileBaseUrl = options.BackendUrl; // TODO: Replace with actual base URL
  }

  /**
   * Override canCalculate method to return true/false based on the shipping option.
   * This will tell Medusa whether the provider can calculate the price for a given shipping option.
   */
  async canCalculate(data: CreateShippingOptionDTO): Promise<boolean> {
    // Always return true to allow price calculation for all shipping options
    // For debugging
    console.log("canCalculate called with:", data);

    // We'll be more permissive to allow shipping option creation
    // Return true even if data is incomplete
    return true;
  }

  /**
   * Lists available shipping/carrier services.
   * This is hardcoded for now. Replace with actual API call when available.
   */
  async getFulfillmentOptions() {
    // TODO: Replace hardcoded options with actual API call in future
    return [
      {
        id: "standard",
        name: "Greenmile Standard Shipping",
      },
      {
        id: "express",
        name: "Greenmile Express Shipping",
      },
      {
        id: "sameday",
        name: "Greenmile sameday Shipping",
      },
      {
        id: "nextday",
        name: "Greenmile nextday Shipping",
      },
    ];
  }

  /**
   * Calculates shipping options and rates from Greenmile API.
   * Expects data in data.shipping_address and data.items
   */

  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: any
  ): Promise<{
    calculated_amount: number
    is_calculated_price_tax_inclusive: boolean
  }> {
    console.log("⚡️ calculatePrice fired!", { optionData, data, context })

    console.log("context: ", context["items"])

    // 1) Destination is on context.shipping_address
    const dest = context.shipping_address
    if (!dest) {
      console.warn("No shipping_address in context!", context)
      return { calculated_amount: 0, is_calculated_price_tax_inclusive: true }
    }

    const origin = {
      address1: "123 Fixed Warehouse Rd",
      address2: "Unit 5",
      postal_code: "L5P 1B2",
      province: "Ontario",
      city: "Mississauga",
      country: "CA",
    }
    // --- dynamic origin example (commented out) ---
    // const originAddr = context.from_location?.address
    // if (originAddr) {
    //   origin = {
    //     address1:   originAddr.address_1,
    //     address2:   originAddr.address_2 || "",
    //     postal_code: originAddr.postal_code,
    //     province:   originAddr.province,
    //     city:       originAddr.city,
    //     country:    originAddr.country_code.toUpperCase(),
    //   }
    // }
    // 3) Items come from context.items
    const items: any[] = context.items || []

    // 4) Build the rate payload
    const payload = {
      rate: {
        service_code: optionData.id,
        destination: {
          address1: dest.address_1,
          address2: dest.address_2 || "",
          postal_code: dest.postal_code,
          province: dest.province,
          city: dest.city,
          country: dest.country_code.toUpperCase(),
        },
        origin,
        items: items.map(item => ({
          grams: item.variant?.weight ?? 1,
          product_id: item.variant?.product_id ?? "",
          variant_id: item.variant?.id ?? "",
        })),
      },
    }

    try {
      // 5) Call your Django calculate_rate view
      const res = await axios.post(
        `${this.greenmileBaseUrl}/calculate_rate/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization:   `Bearer ${this.options_.greenmile_token}`,
          },
        }
      )


      console.log("response ", res.data)

      console.log("price:", res.data.rates[0].total_price)

      // 7) Return in Medusa’s shape
      return {
        calculated_amount: res.data.rates[0].total_price,
        is_calculated_price_tax_inclusive: true,
      }
    } catch (err) {
      console.error("Greenmile calculate rate error:", err)
      return {
        calculated_amount: 50,
        is_calculated_price_tax_inclusive: true,
      }
    }
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: any
  ): Promise<Record<string, unknown>> {
    const optId = optionData.id as string

    // // 2a) Make sure this shipping‐option really came from us
    // if (!GreenmileFulfillmentService.VALID_OPTIONS.includes(optId)) {
    //   throw new Error(
    //     `[greenmile] Shipping option "${optId}" is not handled by Greenmile`
    //   )
    // }

    // // 2b) Make sure there *are* items, and each has a proper SKU
    // const items = context.items as any[] | undefined
    // if (!items || !items.length) {
    //   throw new Error("[greenmile] No items in cart for fulfillment")
    // }

    // for (const item of items) {
    //   const sku = item.variant?.sku as string | undefined
    //   if (!sku || !sku.startsWith("greenmile")) {
    //     throw new Error(
    //       `[greenmile] Invalid SKU "${sku}" – all SKUs must start with "greenmile"`
    //     )
    //   }
    // }

    // 2c) All good → return enriched data
    return {
      ...data,
      service_code: optId,
    }
  }
  /**
   * Creates fulfillment (shipment) using Greenmile API
   * - should contain shipping and item details
   */
  async createFulfillment(
    data: Record<string, any>,
    items: FulfillmentItemDTO[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: FulfillmentDTO
  ): Promise<CreateFulfillmentResult> {
    // Step 1: just create the fulfillment record, do NOT ship yet.
    // no external API call, no labels
    return {
      data: {
        ...data
        // you can pass through metadata or custom flags here if you like
      },
      labels: []  // <–– empty on purpose
    }
  }


  // Optional cancel shipment API call
  async cancelFulfillment(fulfillment: any) {
    // Implement cancel API logic if your provider supports it
    return {};
  }
}

export default GreenmileFulfillmentService;