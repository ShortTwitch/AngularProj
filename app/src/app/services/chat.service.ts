import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx'

import { AuthenticationService } from './authentication.service';

@Injectable()
export class ChatService {

  chatSocket : any;

  constructor(private http : HttpService, private auth : AuthenticationService) { }

  endChat() : void {
    if(this.chatSocket){
      this.chatSocket.close();
      this.chatSocket = null;
    }
  }

  startChat(receiveCB: (m: string) => void): void {

    if(this.chatSocket != null){
      this.chatSocket.close();
      this.chatSocket = null;
    }

    //this.chatSocket = new WebSocket('ws://dsnookproject.com:8081?token=' + this.auth.getToken());
    this.chatSocket = new WebSocket('ws://localhost:8081?token=' + this.auth.getToken());

    this.chatSocket.onopen = function() {
      console.log("SOCKET OPENED");
    };

    this.chatSocket.onmessage = function (evt) {
      let data = JSON.parse(evt.data);
      console.log("ON MESSAGE : " + JSON.stringify(data));
      receiveCB(data);
    };

    this.chatSocket.onclose = function() {
      console.log("ON CLOSE");
    };
  }

  sendMessage(message : string) : void {
    let data = {
      'message' : message
    };
    this.chatSocket.send(JSON.stringify(data));
  };

}
