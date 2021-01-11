import { ProductStatus } from './productStatus.model';

export class Product {
    id: number;
    name: string;
    price: number;
    status: ProductStatus;
    modifiedBy: number;
}
