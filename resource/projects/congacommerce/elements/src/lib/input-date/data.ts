import { CartItem } from "@congacommerce/ecommerce";

export const cartItemValue={
    'PriceListItem':{
        'DefaultSellingTerm': 10
    },
    'PricingFrequency':12,
    'StartDate':'2023/3/3',
    'EndDate':'2023/4/4'
} as unknown as CartItem

export const cartItemValue2={
    'PricingFrequency':12
} as unknown as CartItem

export const cartItemValue3={
    'PricingFrequency':12,
    'EndDate':'2022-02-02'
} as unknown as CartItem