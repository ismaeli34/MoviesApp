import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private  BASE_URL = "http://localhost:8080";

  http= inject(HttpClient);

  constructor() { }
  verifyEmailService(email:string):Observable<String>{
    return this.http.post<string>(`${this.BASE_URL}/forgotPassword/verifyMail/${email}`,null,{
      responseType:'text' as 'json'
    });
  }

  verifyOtpService(otp:string,email:string):Observable<string>{
    return this.http.post<string>(`${this.BASE_URL}/forgotPassword/verifyOtp/${otp}/${email}`,null,{
      responseType:'text' as 'json'
    });
  }

  changePasswordService(changePassword:ChangePassword, email:string):Observable<string>{
    return this.http.post<string>(`${this.BASE_URL}/forgotPassword/changePassword/${email}`,changePassword,{
      responseType:'text' as 'json'
    });
  }

}

export  type ChangePassword ={
  password:string,
  repeatPassword:string
}
