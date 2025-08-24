import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Router, RouterLink, RouterModule} from '@angular/router';
import {ChangePassword, ForgotPasswordService} from '../../services/forgot-password.service';
import {response} from 'express';


@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, RouterLink, ReactiveFormsModule,FormsModule,RouterModule,MatProgressSpinnerModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {


  savedEmail ="";
  isLoading = false;

  constructor(private  formBuilder: FormBuilder) {
    this.verifyEmailForm = this.formBuilder.group({
      email: this.email,
    })
    this.verifyOtpForm = this.formBuilder.group({
      otp: this.otp,
    })
    this.changePasswordForm = this.formBuilder.group({
      password : this.password,
      repeatPassword: this.repeatPassword
    });
  }

  forgotPasswordService = inject(ForgotPasswordService);
  router = inject(Router);
  // first form
  email = new FormControl<string>('',[Validators.email,Validators.required]);
  verifyEmailForm:FormGroup;
  state1 = true;

  // second form
  otp = new FormControl<string>('',[Validators.required,Validators.required]);
  verifyOtpForm:FormGroup;
  state2 = false;


  // third form
  password = new FormControl<string>('',[Validators.required,Validators.required]);
  repeatPassword = new FormControl<string>('',[Validators.required,Validators.required]);
  changePasswordForm: FormGroup;
  state3 = false;

  inlineNotification = {
    show: false,
    type: '',
    text: ''
  }


  verifyOtp(){
    console.log('inside verify otp');
    if (this.verifyOtpForm.valid){
      this.isLoading = true;
      this.forgotPasswordService
        .verifyOtpService(this.verifyOtpForm
          .get('otp')?.value, this.savedEmail).subscribe(
        {
          next:(response) =>{
            this.isLoading = false;
            console.log(response);
            this.state2 = false;
            this.state3 = true;
          }, error :(err)=>{
            this.isLoading = false;
            console.log(err);
          }
        }
      )
    }
  }

  verifyEmail(){
    if (this.verifyEmailForm.valid){
      this.isLoading = true;
      this.forgotPasswordService.verifyEmailService(this.verifyEmailForm.get('email')?.value).subscribe(
        {
          next:(response) =>{
            this.isLoading = false;
            console.log(response);
            this.savedEmail = this.verifyEmailForm.get('email')?.value;
            this.state1  = false;
            this.state2 = true;
          },
          error:(err) =>{
            this.isLoading = false;
            console.log(err);
          }
        }
      )
    }
  }

  changePassword(){
    if (this.changePasswordForm.valid){
      const  changePassword:ChangePassword ={
        password : this.changePasswordForm.get('password')?.value,
        repeatPassword : this.changePasswordForm.get('repeatPassword')?.value
      }

      this.isLoading = true;
      this.forgotPasswordService.changePasswordService(changePassword, this.savedEmail).subscribe(
        {
          next:(response) =>{
            this.isLoading = false;
            console.log(response);
            this.router.navigate(['/login'])

          },
          error:(err) =>{
            this.isLoading = false;
            console.log(err);
          }
        }
      );
    }

  }


}
