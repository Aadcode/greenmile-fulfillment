import GreenmileFulfillmentService from "./service"; // Correct import
import { ModuleProvider, Modules } from "@medusajs/framework/utils";

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [GreenmileFulfillmentService],
});
