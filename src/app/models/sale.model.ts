import { User } from './user.model';
import { SaleDetail } from './saleDetail.model';

export class Sale {
    id: number;
    modifiedBy: User;
    details: SaleDetail[];
}
