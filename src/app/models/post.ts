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