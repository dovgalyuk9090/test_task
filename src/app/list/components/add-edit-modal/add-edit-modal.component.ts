import { Component, Inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookInterface } from '../../interfaces/book.interface';
import { BookService } from '../../services/book.service';
import { BookFormInterface } from '../../interfaces/form.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'book-add-edit-modal',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-edit-modal.component.html',
})
export class AddEditModalComponent implements OnInit {
  form: FormGroup<BookFormInterface>;
  isEditBookForm: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookInterface,
    private fb: NonNullableFormBuilder,
    private readonly bookService: BookService,
  ) {
    this.form = this.fb.group({
      title: [data.title || '', Validators.required],
      author: [data.author || '', Validators.required],
      year: [
        data.year || new Date().getFullYear(),
        [Validators.required, Validators.min(0)],
      ],
      imagePreview: '',
    });

    if (data.imagePreview) {
      this.imagePreview = data.imagePreview;
    }
  }

  ngOnInit(): void {
    this.isEditBookForm = Object.keys(this.data).length !== 0;
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.data, ...this.form.value });
    }
  }

  delete(): void {
    this.bookService.deleteBook(this.data.id);
    this.dialogRef.close({ ...this.data, ...this.form.value });
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const MAX_FILE_SIZE = 1_048_576;

    // NOTE: Ideally, file size validation should be handled through a custom validator
    // applied to the form control. This current implementation is a simpler validation
    // approach.
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('The selected image is too large. Maximum allowed size is 1 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.form.patchValue({ imagePreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }
}
