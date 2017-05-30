import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx'

@Injectable()
export class ChatService {

  constructor(private http : HttpService) { 
    this.getMessages();
  }

  sendMessage(message : string) : void{
    let req = this.http.buildRequest('chat/send', RequestMethod.Post, { message : message });
    this.http.sendRequest(req).subscribe(function(data) {
      console.log("SendMessage responded with : " + JSON.stringify(data));
    });
  }

  getMessages() : Observable<any> {
    let req = this.http.buildRequest('chat/messages', RequestMethod.Get, {});
    return this.http.sendRequest(req);
  }

}
