import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx'

@Injectable()
export class ChatService {

  chatSocket : any;

  messages : any[];

  constructor(private http : HttpService) { 

    let cs = this;
    this.messages = [];
    this.chatSocket = new WebSocket('ws://localhost:8081?token=' + localStorage.getItem('jwt'));

    this.chatSocket.onopen = function() {
      console.log("SOCKET OPENED");
    };

    this.chatSocket.onmessage = function (evt) {
      let data = JSON.parse(evt.data);
      console.log("ON MESSAGE : " + JSON.stringify(data));
      cs.messages.push(data);
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
