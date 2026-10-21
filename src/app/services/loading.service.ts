import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly activeRequests = signal(0);

  readonly isLoading = signal(false);

 start(): void {
  this.activeRequests.update(count => count + 1);
  this.isLoading.set(true);

  setTimeout(() => {
    console.log('Loading after 2 seconds:', this.isLoading());
  }, 20000);
}

  stop(): void {
    this.activeRequests.update(count => Math.max(0, count - 1));
    this.isLoading.set(this.activeRequests() > 0);
  }
}