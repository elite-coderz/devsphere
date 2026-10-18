
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeveloperService } from '../../services/developer.service';
import { OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-developer-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './developer-profile.html',
  styleUrl: './developer-profile.css'
})
export class DeveloperProfileComponent implements OnInit, OnChanges  {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly developerService = inject(DeveloperService);

  readonly developerId = signal<number | null>(null);

  readonly developer = computed(() => {
    const id = this.developerId();

    return id === null
      ? undefined
      : this.developerService.getById(id);
  });

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = Number(params.get('id'));

        this.developerId.set(
          Number.isInteger(id) && id > 0 ? id : -1
        );
      });
  }

  toggleFollow(): void {
    const id = this.developerId();

    if (id !== null && this.developer()) {
      this.developerService.toggleFollow(id);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  console.log('ngOnChanges:', changes);
}
}
