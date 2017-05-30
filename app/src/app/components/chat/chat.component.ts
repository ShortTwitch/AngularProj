import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('scrollMe') private myScrollContainer : ElementRef;

  constructor(private account : AccountService, private chat : ChatService, private router : Router) { }

  messages : Message[] = [];

  ngOnInit() {
    if(!this.account.user) {
      this.router.navigate(['/home']);
    }
    let c = this;
    c.getMessages();
    setInterval(function(){ c.getMessages(); }, 1000);
  }

  message : string = '';

  sendMessage() : void {
    if(this.message.length == 0) { return; }
    this.chat.sendMessage(this.message);
    this.message = '';
    this.getMessages();
  }

  getMessages() : void {
    let c = this;
    c.chat.getMessages().subscribe(function(data){
      c.messages = data.messages;
      c.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    try{
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }catch(err){ }
  }

}
