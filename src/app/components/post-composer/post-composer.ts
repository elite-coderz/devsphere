
import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

export interface CreatePostRequest {
  topic: string;
  content: string;
}

@Component({
  selector: 'app-post-composer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-composer.html',
  styleUrl: './post-composer.css'
})
export class PostComposerComponent {
  open = input(false);

  closed = output<void>();
  submitted = output<CreatePostRequest>();

  readonly postForm = new FormGroup({
    topic: new FormControl('Angular', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]
    }),
    content: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(280)
      ]
    })
  });

  close(): void {
    this.postForm.reset({
      topic: 'Angular',
      content: ''
    });

    this.closed.emit();
  }

  publish(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.postForm.getRawValue());
  }

  resetForm(): void {
    this.postForm.reset({
      topic: 'Angular',
      content: ''
    });
  }
}
