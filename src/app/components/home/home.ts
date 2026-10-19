import { Component, computed, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostCardComponent } from '../post-card/post-card';
import { Post } from '../../models/post';
import { DeveloperService } from '../../services/developer.service';
import { catchError, debounceTime, distinctUntilChanged,
         finalize, map, of, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ ReactiveFormsModule,
    PostCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class HomeComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postService = inject(PostService);
  readonly searchResults = signal<Post[] | null>(null);
  
  readonly searchResultIds = signal<number[] | null>(null);
  readonly isSearching = signal(false);
  readonly searchError = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);

  readonly searchControl = new FormControl('', {
    nonNullable: true
  });

  readonly developerService = inject(DeveloperService);
  readonly filteredPosts = computed(() => {
  const term = this.searchText().trim().toLowerCase();

  
  if (!term) {
    return this.posts();
  }

  return this.posts().filter(post =>
    [
      post.author,
      post.handle,
      post.topic,
      post.content
    ].some(value => value.toLowerCase().includes(term))
  );
});

readonly posts = signal<Post[]>([]);

  // readonly posts = signal<Post[]>([
  //   {
  //     id: 1,
  //     authorId: 1, // Arun's developer ID
  //     author: 'Arun Kumar',
  //     handle: '@arun_codes',
  //     avatar: 'AK',
  //     time: '12 min ago',
  //     topic: 'Angular',
  //     content: 'Angular Signals vs RxJS: when should you use each? Signals are great for reactive UI state, while RxJS shines for asynchronous streams and complex event flows. Understanding both is a superpower!',
  //     likes: 128,
  //     following: false,
  //     comments: 24,
  //     liked: false
  //   },
  //   {
  //     id: 2,
  //     authorId: 2, // Priya's developer ID
  //     author: 'Priya Sharma',
  //     handle: '@priya_dev',
  //     avatar: 'PS',
  //     time: '35 min ago',
  //     topic: '.NET',
  //     content: 'A clean architecture reminder: keep controllers thin, put business rules in the right layer, and make your code easier to test. Small design decisions make a huge difference in maintainability.',
  //     likes: 86,
  //     following: false,
  //     comments: 17,
  //     liked: false
  //   },
  //   {
  //     id: 3,
  //     authorId: 3, // Karthik's developer ID
  //     author: 'Karthik Raj',
  //     handle: '@karthik_ai',
  //     avatar: 'KR',
  //     time: '1 hour ago',
  //     topic: 'AI Engineering',
  //     content: 'Building a RAG application? Start with retrieval quality and evaluation before adding more agents. A complex workflow cannot compensate for poor context retrieval.',
  //     likes: 204,
  //     following: false,
  //     comments: 31,
  //     liked: false
  //   }
  // ]);

  readonly searchText = signal('');
  readonly selectedFeed = signal('For you');

  readonly trendingTopics = [
    { name: 'Angular', posts: '2.4k posts' },
    { name: '.NET', posts: '1.8k posts' },
    { name: 'Agentic AI', posts: '1.2k posts' },
    { name: 'System Design', posts: '890 posts' }
  ];

  toggleLike(postId: number): void {
  this.actionError.set(null);
  this.postService.toggleLike(postId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: updatedPost => {
        this.posts.update(posts =>
          posts.map(post =>
            post.id === updatedPost.id
              ? updatedPost
              : post
          )
        );
      },
      error: error => {
        console.error('Failed to update like:', error);
        this.actionError.set(
          'Unable to update like. Please try again.'
        );
      }
    });
}

toggleBookmark(postId: number): void {
  this.actionError.set(null);
  this.postService.toggleBookmark(postId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: updatedPost => {
        this.posts.update(posts =>
          posts.map(post =>
            post.id === updatedPost.id
              ? updatedPost
              : post
          )
        );
      },
      error: error => {
        console.error('Failed to update bookmark:', error);
        this.actionError.set(
          'Unable to update bookmark. Please try again.'
        );
      }
    });
}
  
postForm = new FormGroup({
  content: new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(280)
  ]),
  topic: new FormControl('Angular', Validators.required)
});

addPost(): void {
  if (this.postForm.invalid) {
    this.postForm.markAllAsTouched();
    return;
  }

  const content = this.postForm.controls.content.value!.trim();
  const topic = this.postForm.controls.topic.value!;

  if (!content) {
    this.postForm.controls.content.setErrors({ required: true });
    return;
  }

  const newPost: Post = {
    id: Date.now(),
    author: 'Your Profile',
    authorId: 0, // Assuming 0 for the current user
    handle: '@you',
    avatar: 'PK',
    time: 'Just now',
    topic,
    content,
    likes: 0,
    following: false,
    comments: 0,
    liked: false
  };

  this.posts.update(posts => [newPost, ...posts]);
  this.postForm.reset({ content: '', topic: 'Angular' });
}


readonly visiblePosts = computed(() => {
  const ids = this.searchResultIds();

  const sourcePosts = ids === null
    ? this.posts()
    : this.posts().filter(post => ids.includes(post.id));

  return sourcePosts.filter(post => {
    const feed = this.selectedFeed();

    if (feed === 'Following') {
      return this.developerService.isFollowing(post.handle);
    }

    if (feed === 'Trending') {
      return post.likes >= 100;
    }

    return true;
  });
});

//  ngOnInit(): void {
//     this.searchControl.valueChanges
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         takeUntilDestroyed(this.destroyRef)
//       )
//       .subscribe(value => {
//         this.searchText.set(value.trim().toLowerCase());
//       });
//   }

  ngOnInit(): void {

     this.postService.getPosts()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: posts => {
        this.posts.set(posts);
      },
      error: error => {
        console.error('Failed to load posts:', error);
      }
    });

    
  this.searchControl.valueChanges.pipe(
  startWith(this.searchControl.value),
  map(term => term.trim()),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => {
    this.isSearching.set(true);
    this.searchError.set(null);

    return this.postService.searchPosts(term).pipe(
      map(results => ({
        ids: results.map(post => post.id),
        error: null as string | null
      })),
      catchError(() => of({
        ids: null as number[] | null,
        error: 'Unable to load posts. Please try again.'
      })),
      finalize(() => this.isSearching.set(false))
    );
  }),
  takeUntilDestroyed(this.destroyRef)
).subscribe(({ ids, error }) => {
  this.searchResultIds.set(ids);
  this.searchError.set(error);
});
}
}

