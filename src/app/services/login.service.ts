import { User } from './../models/user.model';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = environment.url;

  constructor(
    private http: HttpClient
  ) { }

  logIn(request: any) {
    return this.http.post<User>(`${this.url}/login`, request);
  }

}
