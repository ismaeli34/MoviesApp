import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {AuthService, LoginRequest} from '../../services/auth.service';
import {Router, RouterModule} from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf,
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = new FormControl<string>('', [Validators.required]);
  password =
    new FormControl<string>('', [Validators.required, Validators.minLength(5)]);
  loginForm: FormGroup;

  inlineNotification = {
    show: false,
    type: '',
    text: ''
  }

  constructor(private http:HttpClient,
              private authService:AuthService,
              private router: Router,
              private  formBuilder: FormBuilder) {

    this.loginForm = this.formBuilder.group({
      email:this.email,
      password:this.password
    });
  }

  login(){
    console.log(this.loginForm.value);
    if(this.loginForm.valid){
      const loginRequest:LoginRequest ={
        email:this.loginForm.get('email')?.value,
        password:this.loginForm.get('password')?.value,
      }
      this.authService.login(loginRequest).subscribe({
        next:(res:any)=>{
          console.log(res);
          // store tokens
          sessionStorage.setItem('accessToken', res.accessToken);
          sessionStorage.setItem('refreshToken', res.refreshToken);
          sessionStorage.setItem('name', res.name);
          sessionStorage.setItem('username', res.username);
          sessionStorage.setItem('email', res.email);
          this.authService.setLoggedIn(true);
          this.router.navigate(['']);
        },error:(err:any)=>{
          console.log(err);
          this.loginForm.reset();
          this.inlineNotification ={
            show : true,
            type: 'error',
            text: 'Login failed, Please try again !'
          }
        }

      })

    }else{
      this.inlineNotification ={
        show : true,
        type: 'error',
        text: 'Please fill up mandatory fields!'
      }
    }
  }

}
