export interface Developer {
  id: number;
  authorId: number;
  name: string;
  handle: string;
  bio: string;
  skills: string[];
  followers: number;
  following: boolean;
}