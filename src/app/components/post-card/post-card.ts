import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Post {
  id: number;
  authorId: number;
  author: string;
  handle: string;
  avatar: string;
  time: string;
  topic: string;
  content: string;
  likes: number;
  following: boolean;
  comments: number;
  liked: boolean;
  bookmarked?: boolean;
}

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCardComponent {
  post = input.required<Post>();
  likeClicked = output<number>();

  onLike(): void {
    this.likeClicked.emit(this.post().id);
  }

  bookmarkClicked = output<number>();

onBookmark(): void {
  this.bookmarkClicked.emit(this.post().id);
}

}
