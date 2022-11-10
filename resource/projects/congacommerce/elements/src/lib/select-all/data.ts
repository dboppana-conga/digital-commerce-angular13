import { Product, CartItem, Account } from "@congacommerce/ecommerce";

const product1= new Product();
const product2= new Product();
const cartitem1= new CartItem();
const cartitem2= new CartItem();
const cartitem3={
    Name:'test'
}as unknown as CartItem
const allItems=[
    {
        Id:1
    },
    {
        Id:2
    }
]
const selectedItems=[
    {
        Id:1
    },
    {
        Id:2
    }
]

const selectItem=[{
    Ids:2
}]

const allItem=[
    {
        Name:3
    }
]

product2.Name='QA_DC_Product';
product1.Name='QA_DC_Product';
cartitem2.Name='QA_DC_Cartitem';
cartitem1.Name='QA_DC_Cartitem';


export {product1,product2,cartitem1,cartitem2,cartitem3, allItems, selectedItems, selectItem, allItem};
