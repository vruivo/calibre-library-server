const Database = require('better-sqlite3');
const booksDB = require('./books');

const db = new Database('/mnt/c/Disco D/Calibre Portable/demo-library/metadata.db', { fileMustExist: true, readonly: true });


test('getAllBooks', () => {
  const books = booksDB.getAllBooks(db);
  // console.log(books);

  expect(Array.isArray(books)).toBe(true);
  expect(books.length).toBe(3);

  const book = books[0];
  const book_keys = Object.keys(book);

  expect(book_keys.length).toBe(5);
  expect(book_keys).toContain('id');
  expect(book_keys).toContain('title');
  expect(book_keys).toContain('authors');
  expect(book_keys).toContain('path');
  expect(book_keys).toContain('has_cover');
});

test('getBooksWithTitle', () => {
  const books = booksDB.getBooksWithTitle(db, 'adventures');
  // console.log(books);

  expect(Array.isArray(books)).toBe(true);
  expect(books.length).toBe(1);

  const book = books[0];
  const book_keys = Object.keys(book);

  expect(book_keys.length).toBe(5);
  expect(book_keys).toContain('id');
  expect(book_keys).toContain('title');
  expect(book_keys).toContain('authors');
  expect(book_keys).toContain('path');
  expect(book_keys).toContain('has_cover');
});

test('getBookWithId', () => {
  const book = booksDB.getBookWithId(db, 4);
  // console.log(books);

  expect(Array.isArray(book)).toBe(false);
  // expect(books.length).toBe(1);

  // const book = books[0];
  const book_keys = Object.keys(book);

  expect(book_keys.length).toBe(11);
  expect(book_keys).toContain('id');
  expect(book_keys).toContain('title');
  expect(book_keys).toContain('authors');
  expect(book_keys).toContain('path');
  expect(book_keys).toContain('has_cover');
  expect(book_keys).toContain('publish_date');
  expect(book_keys).toContain('formats');
  expect(book_keys).toContain('tags');
  expect(book_keys).toContain('description');
  expect(book_keys).toContain('series');
  expect(book_keys).toContain('filenames');
});