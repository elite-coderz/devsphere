import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse
} from '@angular/common/http';

import { catchError, tap, throwError } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[HTTP] ${req.method} ${req.urlWithParams}`);

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          console.log(
            `[HTTP] Response: ${event.status} ${req.urlWithParams}`
          );
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(
        `[HTTP] Error ${error.status}: ${req.urlWithParams}`,
        error.message
      );

      return throwError(() => error);
    })
  );
};