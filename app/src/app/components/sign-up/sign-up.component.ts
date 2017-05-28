import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  validationMessages = {
    'username': {
      'required':   'Username is required.',
      'pattern' :   'Username must be 4-20 alphanumeric characters.'
    },
    'password': {
      'required':   'Password is required.',
      'pattern':    'Password must be accurate pattern.'
    },
    'confirmPassword': {
      'required':   'Must confirm password.',
      'pattern':    'Password must be accurate pattern.',
      'match' :     'Confirm password does not match.'
    }
  };

  signUpForm  : FormGroup;

  constructor(private httpService : HttpService, private fb : FormBuilder) { 
    this.createSignUpForm()
  }

  ngOnInit() {

  }

  createAccount() : void {
    this.onValueChanged();
    let form = this.signUpForm;
    if(!form.valid){ return; }
    let data = {
      username: form.get('username').value,
      password1: form.get('password').value,
      password2: form.get('confirmPassword').value
    };
    this.httpService.createAccount(data).subscribe(function(data){
      if(data.success){
        form['messages'].push("Account Created.");
      }else{
        form['messages'].push(data.message);
      }
    });
  }

  createSignUpForm(){
    this.signUpForm = this.fb.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^[A-Za-z](?:\w(?!_{2,})){4,18}[A-Za-z0-9]$/)])
      ],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?:.{8,50})$/)])
      ],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?:.{8,50})$/)])
      ]
    }, { validator: PasswordValidation.MatchPassword });
    this.signUpForm['messages'] = [];
  }

  onValueChanged(data? : any) {
    if(!this.signUpForm) { return; }
    
    const form = this.signUpForm;
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

class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if(password != confirmPassword) {
            AC.get('confirmPassword').setErrors( {match: true} )
        } else {
            return null
        }
    }

}