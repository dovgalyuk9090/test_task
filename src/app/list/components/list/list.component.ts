import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookInterface } from '../../interfaces/book.interface';
import { BookService } from '../../services/book.service';
import { AddEditModalComponent } from '../add-edit-modal/add-edit-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  BookTableColumn,
  DEFAULT_BOOK_COLUMNS,
} from '../../types/book-table-columns.type';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'lib-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './list.component.html',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '400ms ease-in',
          style({ opacity: 0, transform: 'translateY(10px)' }),
        ),
      ]),
    ]),
  ],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: BookTableColumn[] = DEFAULT_BOOK_COLUMNS;
  booksDataSource: MatTableDataSource<BookInterface> =
    new MatTableDataSource<BookInterface>([]);
  filterControl: FormControl<string | null> = new FormControl('');

  private destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly bookService: BookService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.setBooksDataSource();
    this.setFilterListener();
  }

  ngAfterViewInit(): void {
    this.booksDataSource.paginator = this.paginator;
    this.booksDataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openEditBookModal(book: BookInterface): void {
    const dialogRef = this.dialog.open(AddEditModalComponent, {
      width: '500px',
      data: { ...book },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookService.updateBook(result);
        this.updateSortingAndPaginator();
      }
    });
  }

  openAddBookModal(): void {
    const dialogRef = this.dialog.open(AddEditModalComponent, {
      width: '500px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookService.addBook(result);
        this.updateSortingAndPaginator();
      }
    });
  }

  setBooksDataSource(): void {
    this.bookService.books$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (books) => (this.booksDataSource = new MatTableDataSource(books)),
      );
  }

  setFilterListener(): void {
    this.filterControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filterValue) => {
        this.booksDataSource.filter = (filterValue || '').trim().toLowerCase();
      });
  }

  private updateSortingAndPaginator(): void {
    this.booksDataSource.paginator = this.paginator;
    this.booksDataSource.sort = this.sort;
  }
}
