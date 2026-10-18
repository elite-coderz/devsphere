
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DeveloperService } from '../../services/developer.service';

@Component({
  selector: 'app-developer-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './developer-profile.html',
  styleUrl: './developer-profile.css'
})
export class DeveloperProfileComponent {
  private route = inject(ActivatedRoute);
  private developerService = inject(DeveloperService);

  readonly developerId = Number(
    this.route.snapshot.paramMap.get('id')
  );

  readonly developer = computed(() =>
    this.developerService.getById(this.developerId)
  );

  toggleFollow(): void {
    this.developerService.toggleFollow(this.developerId);
  }
}
