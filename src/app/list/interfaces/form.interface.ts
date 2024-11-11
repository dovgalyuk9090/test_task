import { FormControl } from '@angular/forms';

export interface BookFormInterface {
  title: FormControl<string>;
  author: FormControl<string>;
  year: FormControl<number>;
  imagePreview: FormControl<string>;
}
