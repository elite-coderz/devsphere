
import { Injectable, inject, signal } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from './post.service';

@Injectable({
  providedIn: 'root'
})
export class PostStore {
  private readonly postService = inject(PostService);

  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  loadPosts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.postService.getPosts().subscribe({
      next: posts => {
        this.posts.set(posts);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Failed to load posts:', error);
        this.error.set('Unable to load posts. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  toggleLike(id: number): void {
  this.postService.toggleLike(id).subscribe({
    next: updatedPost => {
      this.posts.update(posts =>
        posts.map(post =>
          post.id === id ? updatedPost : post
        )
      );
    },
    error: error => {
      console.error('Failed to toggle like:', error);
    }
  });
}

toggleBookmark(id: number): void {
  this.postService.toggleBookmark(id).subscribe({
    next: updatedPost => {
      this.posts.update(posts =>
        posts.map(post =>
          post.id === id ? updatedPost : post
        )
      );
    },
    error: error => {
      console.error('Failed to toggle bookmark:', error);
    }
  });
}

deletePost(id: number): void {
  this.postService.deletePost(id).subscribe({
    next: () => {
      this.posts.update(posts =>
        posts.filter(post => post.id !== id)
      );
    },
    error: error => {
      console.error('Failed to delete post:', error);
    }
  });
}

updatePost(
  id: number,
  request: { topic: string; content: string }
): void {
  this.postService.updatePost(id, request).subscribe({
    next: updatedPost => {
      this.posts.update(posts =>
        posts.map(post =>
          post.id === id ? updatedPost : post
        )
      );
    },
    error: error => {
      console.error('Failed to update post:', error);
    }
  });
}

}
