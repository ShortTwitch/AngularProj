import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import { Account } from '../classes/account';

@Injectable()
export class AccountService {

  constructor(private http : HttpService) { 
    this.user = null;
    this.tokenLogin();
  }

  user : Account;

  logout() : void {
    localStorage.removeItem('jwt');
    this.tokenLogin();
  }

  tokenLogin() : void {
    let accountService = this;
    let req = this.http.buildRequest('account', RequestMethod.Get, {});
    this.http.sendRequest(req).subscribe(function(data){
      console.log("Token data : "+ JSON.stringify(data));
      accountService.user = data.account;
    });
  }

  createAccount(accountData : any) : Observable<any>{
    let req = this.http.buildRequest('account/create', RequestMethod.Post, accountData);
    return this.http.sendRequest(req);
  }

  userLogin(loginData : any) : Observable<any> {
    let req = this.http.buildRequest('account/login', RequestMethod.Post, loginData);
    let res = this.http.sendRequest(req);
    let ac = this;
    res.subscribe(function(data){
      if(data.success){ 
        localStorage.setItem('jwt', data.token); 
        ac.user = data.account
      }
    });
    return res;
  }

}
