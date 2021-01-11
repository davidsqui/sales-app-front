import { Subject } from 'rxjs';
import { Sale } from './../models/sale.model';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  url = environment.url;

  saleMessage = new Subject<string>();

  constructor(
    private http: HttpClient
  ) { }

  findAll(query?: string) {
    return this.http.get<any>(`${this.url}/sales?${query}`);
  }

  save(sale: Sale) {
    return this.http.post(`${this.url}/sales`, sale);
  }
}
