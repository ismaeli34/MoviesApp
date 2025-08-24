import {HttpErrorResponse, HttpRequest} from '@angular/common/http';
import {HttpHandler, HttpHandlerFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {catchError, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>,next:HttpHandlerFn){

  const authService = inject(AuthService);
  if (req.url.includes('/login') ||
      req.url.includes('/register') ||
    req.url.includes('/refresh')){
   return  next(req);
  }

  if (authService.isAuthenticated()){
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      req = addToken(req, token);   // <-- clone request with token
    }
  }

  return next(req).pipe(catchError((error:HttpErrorResponse)=>{
    if(error.status === 401){
    return  handle401Error(req, next);
    }else if(error.status === 403){
      console.warn('Access denied to', req.url);
      return throwError(() => error);
    }
    return throwError(()=>error);
  })
  )
}


function addToken(req:HttpRequest<unknown>,token:string){
  return req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`,
    }
  })
}

function handle401Error(req: HttpRequest<unknown>,next:HttpHandlerFn){
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.refreshToken().pipe(
    switchMap((token:string)=>{
      sessionStorage.setItem('accessToken',token);
      return next(addToken(req,token));
    }),
    catchError(err =>{
      authService.logout();
      router.navigate(['login']);
      return throwError(()=> err);
    })
  )

}
