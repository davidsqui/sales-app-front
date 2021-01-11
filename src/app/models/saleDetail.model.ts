import { Product } from './product.model';
import { Sale } from './sale.model';

export class SaleDetail {
    id: number;
    // sale: Sale;
    product: Product;
    amount: number;
}
