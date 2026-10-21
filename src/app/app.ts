import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    @if (loadingService.isLoading()) {
      <div class="global-loading">Loading...</div>
    }

    <router-outlet />
  `,
  styles: [`
    .global-loading {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 12px;
      background: #2563eb;
      color: white;
      text-align: center;
      z-index: 999999;
    }
  `]
})
export class App {
  readonly loadingService = inject(LoadingService);
}