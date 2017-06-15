import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {

  constructor() { }

  token : any;

  setToken(token) : any {
    this.token = token;
    localStorage.setItem('jwt', token); 
  }

  getToken() : any {
    let localToken = localStorage.getItem('jwt');
    if(localToken && localToken == this.token){
      return localToken;
    }
    if(this.token){ 
      location.reload(true);
    }
  }

  removeToken() : void {
    localStorage.removeItem('jwt');
  }

}
