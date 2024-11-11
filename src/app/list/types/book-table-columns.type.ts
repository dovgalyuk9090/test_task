export type BookTableColumn =
  | 'preview'
  | 'title'
  | 'author'
  | 'year'
  | 'actions';

export const DEFAULT_BOOK_COLUMNS: BookTableColumn[] = [
  'preview',
  'title',
  'author',
  'year',
  'actions',
];
