import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Post } from '../components/post-card/post-card';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  searchPosts(posts: Post[], term: string): Observable<Post[]> {
    const query = term.trim().toLowerCase();

    return of(posts).pipe(
      delay(200), // Simulate an API response delay
      map(items =>
        items.filter(post =>
          post.content.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.topic.toLowerCase().includes(query)
        )
      )
    );
  }
}