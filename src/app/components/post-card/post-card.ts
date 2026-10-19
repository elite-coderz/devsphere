import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/post';
import { Observable } from 'rxjs';



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
export type { Post };

