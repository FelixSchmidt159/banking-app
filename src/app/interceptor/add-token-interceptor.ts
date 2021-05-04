import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (sessionStorage.getItem('user')) {
      const jsonReq: HttpRequest<T> = req.clone({
        setHeaders: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('user')).token}`
        }
      });
      return next.handle(jsonReq);
    }
    return next.handle(req);
  }
}
