import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  address: string;
  password: string;
}


@Injectable({
  providedIn: 'root'
})
export class AccessService {

  currentUser: Profile;

  options = {
    observe: 'body',
    responseType: 'json',
  };

  constructor(private http: HttpClient) { };

  getUserUrl = 'https://thlaccess.azurewebsites.net/api/user/baiyungao@gmail.com';


  getUser() {
    return this.http.get<Profile>(this.getUserUrl);
  }

  login(mail:string, password:string)
  {
    const loginUrl = "https://thlaccess.azurewebsites.net/api/login"
    const body = {
      email:mail,
      pwd: password
    }
    console.log (body);
    return this.http.post(loginUrl,body);
  }  
  

  /**
   * Add a user 
   * Body
  {
    "email":"baiyungao@gmail.com",
    "firstName": "baiyun",
    "lastName": "Gao",
    "phone": "703-395-3090",
    "password": "abcd1234*",
    "state": "VA",
    "address": "5346 Anchor Ct"
  } 
  */
  
  signup(user: Profile)
  {
    const signupUrl = "https://thlaccess.azurewebsites.net/api/adduser"
    const body = {
      "email": user.email,
      "firstName": user.firstName,
      "lastName": user.lastName,
      "phone": user.phone,
      "password": user.password,
      "state": user.state,
      "address": user.address
    }
    console.log (body);
    return this.http.post(signupUrl,body,);
  }

}

