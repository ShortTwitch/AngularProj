import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import { Account } from '../classes/account';

import { Router } from '@angular/router';

import { ChatService } from './chat.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AccountService {

  constructor(private http : HttpService, private chat : ChatService, private router : Router, private auth : AuthenticationService) { 
    this.user = null;
    this.tokenLogin();
  }

  user : Account;

  logout() : void {
    this.auth.removeToken();
    this.user = null;
    this.chat.endChat();
    this.router.navigate(['/home']);
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
        ac.auth.setToken(data.token);
        ac.user = data.account
      }
    });
    return res;
  }

}
