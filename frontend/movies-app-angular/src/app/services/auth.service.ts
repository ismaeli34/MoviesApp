import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {response} from 'express';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private  BASE_URL = "http://localhost:8080";
  private loggedIn = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loggedIn.set(this.isAuthenticated());
  }

  register(registerRequest:RegisterRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>
    (`${this.BASE_URL}/api/v1/auth/register`,registerRequest);
  }


  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false; // SSR mode, storage not available
    }
    const token = sessionStorage.getItem('accessToken');
    return token!=null && !this.isTokenExpired(token);
  }

  logout():void{
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
  }

  login(loginRequest:LoginRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.BASE_URL}/api/v1/auth/login`,loginRequest).pipe(tap(response=>{
      if(response && response.accessToken){
        sessionStorage.setItem('accessToken',response.accessToken);
        sessionStorage.setItem('refreshToken',response.refreshToken);
        sessionStorage.setItem('name',response.name);
        sessionStorage.setItem('username',response.username);
        sessionStorage.setItem('email',response.email);
        const decodedToken:any = jwtDecode(response.accessToken);
        console.log("decoded token =", decodedToken);
        sessionStorage.setItem('role',decodedToken.role[0].authority);
      }
    }));
  }


  setLoggedIn(value:boolean){
    this.loggedIn.set(value);
  }


  getLoggedIn():WritableSignal<boolean>{
    return  this.loggedIn;
  }

  isTokenExpired(token:string):boolean{
   const decodedToken:any= jwtDecode(token);
   return (decodedToken.exp * 1000) < Date.now();
  }

  refreshToken():Observable<any>{
    const refToken = sessionStorage.getItem('refreshToken');
    const rtObj : RefreshTokenRequest ={
      refreshToken:refToken
    }
    return this.http.post(`${this.BASE_URL}/api/v1/auth/refresh`,{rtObj}).pipe(
      tap((response:any)=>sessionStorage.setItem('accessToken',response.accessToken)),
      catchError(err =>{
        this.logout();
        return throwError(()=>err);
      })
    )
  }

  hasRole(role:string): boolean{
    if (typeof window === 'undefined') {
      return false; // SSR mode, storage not available
    }
    const token = sessionStorage.getItem('accessToken');
    if (token){
      const decodedToken:any = jwtDecode(token);
      // console.log("decoded token =", decodedToken);

      return  decodedToken?.role[0]?.authority.includes(role);
    }
    return false;
  }

}



export type RegisterRequest ={
    name:string,
    email:string,
    username:string,
    password:string
  }

  export type AuthResponse ={
  accessToken:string,
    refreshToken:string,
    name:string,
    email:string,
    username:string,
}

export type LoginRequest ={
  email:string,
  password:string
}

export type RefreshTokenRequest = {
  refreshToken:string | null
}
