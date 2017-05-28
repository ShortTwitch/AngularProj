import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validationMessages = {
    'username': {
      'required':   'Username is required.'
    },
    'password': {
      'required':   'Password is required.'
    }
  };

  constructor(private httpService : HttpService, private fb : FormBuilder) { 
    this.createLoginForm()
  }
  
  loginForm  : FormGroup;

  ngOnInit() {

  }

  login() : void {
    this.onValueChanged();
    let form = this.loginForm;
    if(!form.valid){ return; }
    let data = {
      username: form.get('username').value,
      password: form.get('password').value,
    };
    this.httpService.userLogin(data).subscribe(function(data){
      if(data.success){
        form['messages'].push("Login Successful.");
      }else{
        form['messages'].push("Login Unsuccessful.");
      }
      console.log("data: " + JSON.stringify(data));
    });
  }

  createAccount() : void {
    this.onValueChanged();
    if(!this.loginForm.valid){ return; }
  }

  createLoginForm(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loginForm['messages'] = [];
  }

  onValueChanged(data? : any) {
    if(!this.loginForm) { return; }
    
    const form = this.loginForm;
    form['messages'] = [];

    for(const field in form.controls){
      const control = form.get(field);
      if(control && !control.valid){
        const messages = this.validationMessages[field];
        for(const key in control.errors){
          form['messages'].push(messages[key]);
        }
      }
    }
  }

}