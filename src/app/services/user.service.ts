import { User } from './../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.url;

  constructor(
    private http: HttpClient
  ) { }

  findAll() {
    return this.http.get<User[]>(`${this.url}/users`);
  }
}
