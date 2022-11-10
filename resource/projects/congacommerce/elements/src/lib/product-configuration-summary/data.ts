import { Product, CartItem } from "@congacommerce/ecommerce";

const PRODUCT_MOCK = new Product()
PRODUCT_MOCK.Name = "Temperature Calibration for PTU30T";
PRODUCT_MOCK.Id = "0ebb3fa0-59e5-472a-9678-62d45d5d0344";
PRODUCT_MOCK.Description = "One point temperature calibration at ambient. The service includes the instrument adjustment to meet its specification, calibration certificate, service report, functional testing and wearing parts.";
PRODUCT_MOCK.IsActive = true;
PRODUCT_MOCK.HasDefaults = false;

const cartitem= new CartItem()
cartitem.Id='456';
cartitem.LineStatus="Completed";
cartitem.LineType="Product/Service";
cartitem.Product=PRODUCT_MOCK;
cartitem.LineNumber=1;

export { PRODUCT_MOCK, cartitem }