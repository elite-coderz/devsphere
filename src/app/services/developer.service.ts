import { Injectable, signal } from '@angular/core';
import { Developer } from '../models/developer';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  readonly developers = signal<Developer[]>([
    {
      id: 1,
      authorId: 1, // Arun's developer ID
      name: 'Arun Kumar',
      handle: '@arun_codes',
      bio: 'Angular developer exploring modern web technologies.',
      skills: ['Angular', 'TypeScript', 'RxJS'],
      followers: 1280,
      following: false
    },
    {
      id: 2,
      authorId: 2, // Priya's developer ID  
      name: 'Priya Sharma',
      handle: '@priya_dev',
      bio: '.NET engineer passionate about clean architecture.',
      skills: ['C#', '.NET', 'SQL Server'],
      followers: 950,
      following: true
    }
  ]);

  getById(id: number): Developer | undefined {
    return this.developers().find(developer => developer.id === id);
  }

  
isFollowing(handle: string): boolean {
  return this.developers().some(
    developer => developer.handle === handle && developer.following
  );
}

  toggleFollow(id: number): void {
    this.developers.update(developers =>
      developers.map(developer =>
        developer.id === id
          ? {
              ...developer,
              following: !developer.following,
              followers: developer.followers +
                (developer.following ? -1 : 1)
            }
          : developer
      )
    );
  }
}