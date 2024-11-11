import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookInterface } from '../interfaces/book.interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly storageKey = 'books';
  private books = new BehaviorSubject<BookInterface[]>(
    this.loadBooksFromStorage(),
  );

  books$ = this.books.asObservable();

  updateBook(updatedBook: BookInterface): void {
    const updatedBooks: BookInterface[] = this.books.value.map((book) =>
      book.id === updatedBook.id ? updatedBook : book,
    );
    this.updateBooks(updatedBooks);
  }

  addBook(newBook: BookInterface): void {
    const currentBooks: BookInterface[] = this.books.value;
    const maxId: number = this.books.value.length
      ? Math.max(...currentBooks.map((book: BookInterface) => book.id || 0))
      : 0;
    const uniqueId: number = maxId + 1;
    const updatedBooks = [...currentBooks, { ...newBook, id: uniqueId }];
    this.updateBooks(updatedBooks);
  }

  deleteBook(bookId: number): void {
    const isBookExists: boolean = this.books.value.some(
      (book) => book.id === bookId,
    );
    if (!isBookExists) {
      console.warn(`Book with id ${bookId} does not exist.`);
      return;
    }

    const updatedBooks: BookInterface[] = this.books.value.filter(
      (book) => book.id !== bookId,
    );
    this.updateBooks(updatedBooks);
  }

  private updateBooks(updatedBooks: BookInterface[]): void {
    this.books.next(updatedBooks);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedBooks));
  }

  private loadBooksFromStorage(): BookInterface[] {
    // We can move local storage logic to a separate service to centralize storage handling,
    // but for the current task, this approach is sufficient.

    const booksData = localStorage.getItem(this.storageKey);
    return booksData
      ? JSON.parse(booksData)
      : [
          {
            id: 1,
            title: 'Book 1',
            author: 'Author 1',
            year: 2000,
            imagePreview: '',
          },
          {
            id: 2,
            title: 'Book 2',
            author: 'Author 2',
            year: 2005,
            imagePreview: '',
          },
          {
            id: 3,
            title: 'Book 3',
            author: 'Author 8',
            year: 1996,
            imagePreview: '',
          },
          {
            id: 4,
            title: 'Book 4',
            author: 'Author 8',
            year: 1996,
            imagePreview: '',
          },
          {
            id: 5,
            title: 'Book 5',
            author: 'Author 8',
            year: 1996,
            imagePreview: '',
          },
        ];
  }
}
