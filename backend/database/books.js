// const Database = require('better-sqlite3');
// const { get } = require('express/lib/response');


module.exports = (function BooksRoutes() {

  function getAllBooks(db) {
    // const rows = db.prepare(`SELECT books.id, books.title, books.path, books.has_cover,
    // (SELECT GROUP_CONCAT(authors.name)
    //   FROM authors
    //   INNER JOIN books_authors_link ON books_authors_link.author = authors.id
    //   WHERE books_authors_link.book = books.id) AS authors
    // FROM books`).all();

    const rows = db.prepare(`SELECT books.id, books.title, books.path, books.has_cover,
    GROUP_CONCAT(authors.name) AS authors
    FROM books
    INNER JOIN books_authors_link ON books_authors_link.book = books.id
    INNER JOIN authors ON books_authors_link.author = authors.id
    GROUP BY books.id`).all();

    return rows.map(book => {
      return {
        id: book.id,
        title: book.title,
        authors: book.authors.split(','),
        path: book.path,
        has_cover: book.has_cover
      }
    })
  }


  function getBookWithId(db, id) {
    // console.log(db);
    const rows = db.prepare(`SELECT books.id AS id, books.title AS title, authors.name AS author, data.format AS format, data.name AS filename, series.name AS series, comments.text AS description, tags.name AS tag, books.path AS path, books.has_cover AS has_cover
    FROM books_authors_link

    INNER JOIN books ON books_authors_link.book = books.id
    INNER JOIN authors ON books_authors_link.author = authors.id

    INNER JOIN data ON books.id = data.book

    LEFT JOIN books_series_link ON books_series_link.book = books.id
    LEFT JOIN series ON books_series_link.series = series.id

    LEFT JOIN comments ON books.id = comments.book

    LEFT JOIN books_tags_link ON books_tags_link.book = books.id
    LEFT JOIN tags ON tags.id = books_tags_link.tag

    WHERE books.id = ?`).all(id);

    // console.log(rows);

    const authors_set = new Set();
    const formats_set = new Set();
    const filenames_set = new Set();
    const tags_set = new Set();

    rows.forEach(r => {
      authors_set.add(r.author);
      formats_set.add(r.format);
      filenames_set.add(r.filename);
      tags_set.add(r.tag);
    })

    return {
      id: rows[0].id,
      title: rows[0].title,
      publish_date: rows[0].pubdate,
      authors: [ ...authors_set ],
      formats: [ ...formats_set ],
      tags: [ ...tags_set ],
      filenames: [ ...filenames_set ],
      description: rows[0].description,
      series: rows[0].series,
      path: rows[0].path,
      has_cover: rows[0].has_cover
    };
  }


  function getBooksWithTitle(db, title) {
    const rows = db.prepare(`SELECT books.id, books.title, books.path, books.has_cover,
    GROUP_CONCAT(authors.name) AS authors
    FROM books
    INNER JOIN books_authors_link ON books_authors_link.book = books.id
    INNER JOIN authors ON books_authors_link.author = authors.id
    WHERE title LIKE ?
    GROUP BY books.id`).all(`%${title}%`);

    return rows.map(book => {
      return {
        id: book.id,
        title: book.title,
        authors: book.authors.split(','),
        path: book.path,
        has_cover: book.has_cover
      }
    })
  }


  return {
    getAllBooks,
    getBookWithId,
    getBooksWithTitle
  }
})()
