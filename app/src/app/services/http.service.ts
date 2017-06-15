import { Injectable } from '@angular/core';
import { Http, Request, Headers, RequestOptions, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpService {

  private server_base = 'http://dsnookproject.com:8081/';
  //private server_base = 'http://localhost:8081/';

  constructor(private http : Http, private auth : AuthenticationService) { }

  buildRequest(url : string, methodType : RequestMethod, data : any) : Request{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    var token = this.auth.getToken();
    if(token){ headers.append('Authorization', 'Bearer ' + token); }

    let requestOptions = new RequestOptions({
      method: methodType,
      url: this.server_base + url,
      headers: headers,
      body: JSON.stringify(data)
    });
    return new Request(requestOptions);
  }

  sendRequest(req : Request){
    return this.http.request(req).map(res => res.json());
  }

}
