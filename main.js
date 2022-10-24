const form = document.querySelector("#inputBook");
const inputBookTitle = document.querySelector("#inputBookTitle");
const inputBookYear = document.querySelector("#inputBookYear");
const inputBookAuthor = document.querySelector("#inputBookAuthor");
const inputBookIsComplete = document.querySelector("#inputBookIsComplete");
const incompleteBookshelfList = document.querySelector(
  "#incompleteBookshelfList"
);
const completeBookshelfList = document.querySelector("#completeBookshelfList");
const search = document.querySelector("#searchBook");
const searchBookTitle = document.querySelector("#searchBookTitle");

let books = JSON.parse(localStorage.getItem("books")) || [];
let editId;
let isEdit = false;

form.addEventListener("submit", function (e) {
  addBook({
    id: new Date().getTime(),
    title: inputBookTitle.value,
    year: parseInt(inputBookYear.value),
    author: inputBookAuthor.value,
    isComplete: inputBookIsComplete.checked,
  });
  inputBookTitle.value = "";
  inputBookYear.value = "";
  inputBookAuthor.value = "";
  inputBookIsComplete.checked = false;
  e.preventDefault();
});

search.addEventListener("submit", function (e) {
  showBooks(searchBookTitle.value);
  searchBookTitle.value = "";
  e.preventDefault();
});

function addBook(data) {
  let tujuan = data.isComplete
    ? "completeBookshelfList"
    : "incompleteBookshelfList";
  if (!localStorage.getItem("books")) {
    JSON.stringify(localStorage.setItem("books", "[]"));
  }
  if (isEdit) {
    books[editId].title = data.title;
    books[editId].author = data.author;
    books[editId].year = data.year;
    books[editId].isComplete = data.isComplete;
    isEdit = false;
  } else {
    books.push(data);
  }
  localStorage.setItem("books", JSON.stringify(books));
  showBooks();
  document.querySelector(`#${tujuan}`).scrollIntoView({ behavior: "smooth" });
}

function showBooks(search = "") {
  let contentComplete = [];
  let contentIncomplete = [];
  books.forEach((book, index) => {
    if (book.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
      if (book.isComplete) {
        contentComplete += `<article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>

            <div class="action">
              <button onclick="updateBook(${index},${false})" class="green">Belum selesai di Baca</button>
              <button onclick="deleteBook(${index})" class="red">Hapus buku</button>
              <button onclick="editBook(${index})" class="yellow">Edit buku</button>
            </div>
          </article>`;
      } else if (!book.isComplete) {
        contentIncomplete += `<article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <div class="action">
              <button onclick="updateBook(${index},${true})" class="green">Selesai dibaca</button>
              <button onclick="deleteBook(${index})" class="red">Hapus buku</button>
              <button onclick="editBook(${index})" class="yellow">Edit buku</button>
            </div>
          </article>`;
      }
    }
  });
  completeBookshelfList.innerHTML = contentComplete;
  incompleteBookshelfList.innerHTML = contentIncomplete;
}

function updateBook(idBook, aksi) {
  books[idBook].isComplete = aksi;
  localStorage.setItem("books", JSON.stringify(books));
  showBooks();
}
function deleteBook(idBook) {
  const iya = confirm("yakin ingin hapus ?");
  if (iya) {
    books.splice(idBook, 1);
    localStorage.setItem("books", JSON.stringify(books));
    showBooks();
  }
  return false;
}

function editBook(idBook) {
  editId = idBook;
  isEdit = true;
  const data = books[idBook];
  inputBookTitle.value = data.title;
  inputBookYear.value = data.year;
  inputBookAuthor.value = data.author;
  inputBookIsComplete.checked = data.isComplete;
  form.scrollIntoView({ behavior: "smooth" });
}

showBooks();
