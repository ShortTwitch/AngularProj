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

  constructor(private account : AccountService, private chat : ChatService, 
                private router : Router, private el : ElementRef) { }

  ngOnInit() {
    if(!this.account.user) {
      this.router.navigate(['/home']);
    }
    this.chat.startChat(this.receiveMessage.bind(this));
  };

  message : string = '';

  messages : string[] = [];

  doScroll : boolean = true;

  sendMessage() : void {
    if(this.message.length == 0) { return; }
    this.chat.sendMessage(this.message);
    this.message = '';
    this.scrollDown();
  };

  receiveMessage(message : string) : void {
    this.messages.push(message);
    this.scrollDown();
  };

  scrollDown () : void {
    let chat_area = this.el.nativeElement.children.chat_area;
    let block = chat_area.children[0].children.messageBlock
    block.scrollTop = block.scrollHeight;
  }

};