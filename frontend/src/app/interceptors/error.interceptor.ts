import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../components/toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado.';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          errorMessage = 'Sessão expirada ou não autorizada. Faça login novamente.';
        } else if (error.status === 403) {
          errorMessage = 'Acesso negado.';
        } else if (error.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
      }

      toastService.show(errorMessage, 'error');
      
      return throwError(() => error);
    })
  );
};
