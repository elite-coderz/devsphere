import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Post } from '../components/post-card/post-card';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// IN MEMORY
// export class PostService {
//   searchPosts(posts: Post[], term: string): Observable<Post[]> {
//     const query = term.trim().toLowerCase();

//     return of(posts).pipe(
//       delay(200), // Simulate an API response delay
//       map(items =>
//         items.filter(post =>
//           post.content.toLowerCase().includes(query) ||
//           post.author.toLowerCase().includes(query) ||
//           post.topic.toLowerCase().includes(query)
//         )
//       )
//     );
//   }
// }

export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7222/api/posts';
//   private readonly apiUrl = 'http://localhost:5109/api/posts';

  searchPosts(search: string): Observable<Post[]> {
    const params = new HttpParams().set('search', search);

    return this.http.get<Post[]>(this.apiUrl, { params });
  }

  
createPost(request: { topic: string; content: string }): Observable<Post> {
  return this.http.post<Post>(this.apiUrl, request);
}

updatePost(
  id: number,
  request: { topic: string; content: string }
): Observable<Post> {
  return this.http.put<Post>(
    `${this.apiUrl}/${id}`,
    request
  );
}

deletePost(id: number): Observable<void> {
  return this.http.delete<void>(
    `${this.apiUrl}/${id}`
  );
}
  getPosts(): Observable<Post[]> {
  return this.http.get<Post[]>(this.apiUrl);
}

  toggleLike(id: number): Observable<Post> {
  return this.http.put<Post>(
    `${this.apiUrl}/${id}/like`,
    {}
  );
}

toggleBookmark(id: number): Observable<Post> {
  return this.http.put<Post>(
    `${this.apiUrl}/${id}/bookmark`,
    {}
  );
}
}