import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostCardComponent, Post } from '../post-card/post-card';
import { DeveloperService } from '../../services/developer.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ ReactiveFormsModule,
    PostCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class HomeComponent {

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

  readonly posts = signal<Post[]>([
    {
      id: 1,
      authorId: 1, // Arun's developer ID
      author: 'Arun Kumar',
      handle: '@arun_codes',
      avatar: 'AK',
      time: '12 min ago',
      topic: 'Angular',
      content: 'Angular Signals vs RxJS: when should you use each? Signals are great for reactive UI state, while RxJS shines for asynchronous streams and complex event flows. Understanding both is a superpower!',
      likes: 128,
      following: false,
      comments: 24,
      liked: false
    },
    {
      id: 2,
      authorId: 2, // Priya's developer ID
      author: 'Priya Sharma',
      handle: '@priya_dev',
      avatar: 'PS',
      time: '35 min ago',
      topic: '.NET',
      content: 'A clean architecture reminder: keep controllers thin, put business rules in the right layer, and make your code easier to test. Small design decisions make a huge difference in maintainability.',
      likes: 86,
      following: false,
      comments: 17,
      liked: false
    },
    {
      id: 3,
      authorId: 3, // Karthik's developer ID
      author: 'Karthik Raj',
      handle: '@karthik_ai',
      avatar: 'KR',
      time: '1 hour ago',
      topic: 'AI Engineering',
      content: 'Building a RAG application? Start with retrieval quality and evaluation before adding more agents. A complex workflow cannot compensate for poor context retrieval.',
      likes: 204,
      following: false,
      comments: 31,
      liked: false
    }
  ]);

  readonly searchText = signal('');
  readonly selectedFeed = signal('For you');

  readonly trendingTopics = [
    { name: 'Angular', posts: '2.4k posts' },
    { name: '.NET', posts: '1.8k posts' },
    { name: 'Agentic AI', posts: '1.2k posts' },
    { name: 'System Design', posts: '890 posts' }
  ];

  toggleLike(id: number): void {
    this.posts.update(posts =>
      posts.map(post => {
        if (post.id !== id) {
          return post;
        }

        return {
          ...post,
          liked: !post.liked,
          likes: post.likes + (post.liked ? -1 : 1)
        };
      })
    );
  }

toggleBookmark(id: number): void {
  this.posts.update(posts =>
    posts.map(post =>
      post.id === id
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    )
  );
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
  const term = this.searchText().trim().toLowerCase();
  const tab = this.selectedFeed();

  return this.posts().filter(post => {
    const matchesSearch = [
      post.author,
      post.handle,
      post.topic,
      post.content
    ].some(value => value.toLowerCase().includes(term));

    const matchesTab =
      tab === 'For you' ||
      (tab === 'Following' && 
        this.developerService.isFollowing(post.handle)) ||
      (tab === 'Trending' && post.likes >= 100);

    return matchesSearch && matchesTab;
  });
});

}
