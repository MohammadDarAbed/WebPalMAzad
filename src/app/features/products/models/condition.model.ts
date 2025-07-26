


export enum ProductCondition { // TODO: Get from API
    New = 1,    // Brand new product
    Used = 2,   // Pre-owned product
    Service = 3 // Non-tangible service (e.g., cleaning, tutoring)
};

export const ProductConditionOptions = [
    { id: ProductCondition.New, name: 'New' },
    { id: ProductCondition.Used, name: 'Used' },
    { id: ProductCondition.Service, name: 'Service' }
];
