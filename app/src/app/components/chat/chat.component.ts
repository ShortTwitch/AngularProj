import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../../services/account.service';
import { ChatService } from '../../services/chat.service';

import { Message } from '../../classes/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(
    private account : AccountService, 
    private chat : ChatService, 
    private router : Router, private el : ElementRef
    ) { 
    this.messages = [];
    this.guests = [];
    this.message = '';
    }

  ngOnInit() {
    if(!this.account.user) {
      this.router.navigate(['/home']);
    }
    this.messages = [];
    this.guests = [];
    this.message = '';
    this.chat.startChat(this.receiveMessage.bind(this));
  };

  message : string;

  messages : string[];

  guests : string[];

  doScroll : boolean = true;

  sendMessage() : void {
    if(this.message.length == 0) { return; }
    this.chat.sendMessage(this.message);
    this.message = '';
    this.scrollDown();
  };

  receiveMessage(message : any) : void {
    console.log("Message : " + JSON.stringify(message));
    switch(message.type){
      case 'userJoin':
        console.log('c1');
        this.messages.push('User ' + message.data + ' has joined the chat.');
        this.guests.push(message.data);
        break;
      case 'guestStatus':
        console.log('c2');
        this.guests = message.data;
        break;
      case 'userLeave':
        console.log('c3');
        for(let i = 0; i < this.guests.length; i++){
          if(this.guests[i] == message.data){
            this.guests.splice(i, 1);
            this.messages.push('User ' + message.data + ' has left the chat.');
          }
        }
        break;
      case 'message':
        console.log('c4');
        this.messages.push('{ ' + message.data.fromUser + ' } : ' + message.data.message);
        break;
    }
    this.scrollDown();
  };

  scrollDown () : void {
    //let chat_area = this.el.nativeElement.children.chat_area;
    //let block = chat_area.children[0].children.messageBlock
    //block.scrollTop = block.scrollHeight;
  }

};