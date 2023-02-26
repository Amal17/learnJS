const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher,
    pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. ' +
              'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  let booksData = books;
  if (request.query.reading !== undefined) {
    if (request.query.reading === '0' || request.query.reading === '1') {
      booksData = booksData.filter((x) =>
        (x.reading == request.query.reading),
      );
    }
  }

  if (request.query.finished !== undefined) {
    if (request.query.finished === '0' || request.query.finished === '1') {
      booksData = booksData.filter((x) =>
        (x.finished == request.query.finished),
      );
    }
  }

  if (request.query.name !== undefined) {
    booksData = booksData.filter((x) =>
      x.name.toLowerCase().includes(request.query.name.toLowerCase()));
  }

  booksData = booksData.map((x) =>
    ({
      'id': x.id, 'name': x.name, 'publisher': x.publisher,
    }));

  const response = h.response({
    status: 'success',
    data: {
      books: booksData,
    },
  });
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. ' +
                'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author, summary,
      publisher, pageCount, readPage, reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {bookid} = request.params;

  const index = books.findIndex((book) => books.id === bookid);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler};
