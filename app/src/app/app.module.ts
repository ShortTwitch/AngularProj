import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';

import { HttpService } from './services/http.service';
import { AccountService } from './services/account.service';
import { ChatService } from './services/chat.service';
import { AuthenticationService } from './services/authentication.service';

import { ChatComponent } from './components/chat/chat.component';
import { AccountComponent } from './components/account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    ChatComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignUpComponent
      },
      {
        path: 'chat',
        component: ChatComponent
      },
      {
        path: 'account',
        component: AccountComponent
      }
    ])
  ],
  providers: [HttpService, AccountService, ChatService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { 

  

}
