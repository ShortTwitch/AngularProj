import { Injectable } from '@angular/core';
import { Http, Request, Headers, RequestOptions, RequestMethod, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

  constructor(private http : Http) { }

  private server_base = 'http://localhost:8081/';

  buildRequest(url : string, data : any) : Request{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    var token = localStorage.getItem('jwt');
    if(token){ headers.append('Authorization', 'Bearer ' + token); }

    let requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this.server_base + url,
      headers: headers,
      body: JSON.stringify(data)
    });
    return new Request(requestOptions);
  }

  createAccount(accountData : any) : Observable<any>{
    let req = this.buildRequest('account/create', accountData);
    return this.http.request(req).map(res => res.json());
  }

  userLogin(loginData : any) : Observable<any> {
    let req = this.buildRequest('account/login', loginData);
    return this.http.request(req).map(res => res.json());
  }

}
