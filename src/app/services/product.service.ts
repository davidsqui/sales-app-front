import { Product } from './../models/product.model';
import { ProductStatus } from './../models/productStatus.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.url;
  productSubject = new Subject<Product[]>();

  constructor(
    private http: HttpClient
  ) { }

  findAll() {
    return this.http.get<any>(`${this.url}/products`);
  }

  findAllStatus() {
    return this.http.get<ProductStatus[]>(`${this.url}/products/status`);
  }

  save(product: Product) {
    return this.http.post(`${this.url}/products`, product);
  }

  update(product: Product) {
    return this.http.put(`${this.url}/products`, product);
  }

  delete(productId: number) {
    return this.http.delete(`${this.url}/products/${productId}`);
  }
}
