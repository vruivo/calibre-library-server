const Database = require('better-sqlite3');
const express = require('express');
const path = require('path');
const fs = require('fs');
const books_routes = require('./backend/routes/books');

const app = express();
const port = 3000;
const available_libraries = [];

const myArgs = process.argv.slice(2);

myArgs.forEach(function argReader(arg) {
  try {
    const book_library_path = path.resolve(arg);
    const book_library_db_path = path.join(book_library_path, '/metadata.db');
    
    fs.accessSync(book_library_db_path, fs.constants.R_OK);

    const book_library_name = path.basename(book_library_path);

    const book_library_db = new Database(book_library_db_path, { fileMustExist: true, readonly: true });

    available_libraries.push( {
      name: book_library_name,
      path: book_library_path,
      database: book_library_db
    })
  }
  catch(err) {}
})

if (available_libraries.length === 0) {
  console.error('\nERROR: No valid databases found !!');
  console.log(`\nUsage:
  npm run start <path to Calibre library dir> [<optinal aditional paths to more Calibre libraries>]\n`);
  process.exitCode = 1;
  return;
}


app.param('library', function (req, res, next, library_name) {
  // try to get the user details from the User model and attach it to the request object
  // User.find(id, function (err, user) {
  //   if (err) {
  //     next(err)
  //   } else if (user) {
  //     req.user = user
  //     next()
  //   } else {
  //     next(new Error('failed to load user'))
  //   }
  // })

  const selected_library = available_libraries.find(library => library.name === library_name);
  //TODO: if selected_library = undefined send error
  req.db = selected_library;
  next();
})


app.use('/', require('./frontend/routes'));
app.use('/api/:library', books_routes);

app.use('/api/version', function(req, res) {
  res.send({ version: 0.7});
});


app.get('/api/libraries', function (req, res) {
  const libraries_names = available_libraries.map(library => library.name);
  res.send(libraries_names);
});

app.get('/covers/:library/*', function (req, res) {
  const filepath = req.params[0];

  if (filepath == null) {
    return res.sendStatus(404);
  }

  const library_root = req.db.path;
  const cover_file = path.join(filepath, 'cover.jpg');
  
  res.sendFile(cover_file, {
    root: library_root
  }, function (err) {
    if (err) {
      console.log('Error:', err);
      return res.sendStatus(404);
    } else {
      console.log('Sent:', cover_file);
    }
  });
});

app.get('/files/:library/', function (req, res) {
  const library_root = req.db.path;

  if (req.query.path == null || req.query.filename == null || req.query.format == null) {
    return res.sendStatus(404);
  }

  const filepath = req.query.path;
  const filename = req.query.filename;
  const format = req.query.format.toLowerCase();

  const accepted_formats = ['epub', 'kepub', 'mobi', 'pdf'];
  if ( accepted_formats.includes(format) === false ) {
    return res.sendStatus(415);
  }

  const ebook_file = path.join(filepath, filename) + `.${format}`;

  const final_filename = format === 'kepub' ? `${filename}.${format}.epub` : `${filename}.${format}`;
  
  res.sendFile(ebook_file, {
    root: library_root,
    headers: {
      'Content-Disposition': `attachment; filename="${final_filename}"`
    }
  }, function (err) {
    if (err) {
      console.log('Error:', err);
      return res.sendStatus(404);
    } else {
      console.log('Sent:', final_filename);
    }
  });
});


app.listen(port, () => {
  console.log(`Calibre Library Bookserver is listening on http://localhost:${port}`);
  console.log('and is using the databases:');
  available_libraries.forEach(library => console.log(`  - ${library.name}`));
  console.log();
})