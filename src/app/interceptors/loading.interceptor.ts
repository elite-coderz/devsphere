import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  console.log('[Loader] Request started:', req.url);

  loadingService.start();

  return next(req).pipe(
    finalize(() => loadingService.stop())
  );
};