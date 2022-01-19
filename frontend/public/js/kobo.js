/*
  JS file written in ES5 to mantain compatibility with older devices.
*/

document.write("Load successfull!");

function search() {
  document.querySelector('#root').innerHTML='search';
  const searchtype = document.querySelector('#type').value;
  const selected_library = document.querySelector('#library').value;
  if (searchtype === 'book') {
    getBooks(selected_library, document.querySelector('#searchbox').value);
  }
  if (searchtype === 'tag') {
    getTags(selected_library, document.querySelector('#searchbox').value);
  }
}

function getBooks(selected_library, book_title) {
  document.querySelector('#root').innerHTML='get books';
  // fetch(`api/Calibre Library/books/${book_title}`)
  // .then(data => { return data.json() })
  // .then(appendBookSearchResults);

  // makeRequest('api/Calibre Library/books/' + book_title, appendBookSearchResults)
  makeRequest('api/'+ selected_library +'/books/?title=' + book_title, appendBookSearchResults.bind(this, selected_library))
}

function appendBookSearchResults(library, books) {
  document.querySelector('#root').innerHTML='append results';
  for (var x=0; x<books.length; x++) {
    document.querySelector('#root').insertAdjacentHTML('beforeend','<div style="border-bottom-style: solid; padding: 20px 0px 20px 10px;border-width: thin;" onclick=divclick(this) data-library="'+library+'" data-bookid="'+ books[x].id +'">' +
    '<div>'+ books[x].title +'</div>' +
    '</div>'
    );
  }
}

function populateAvailableLibraries(libraries) {
  const libraries_selector = document.querySelector('#library');
  var lib_name, option;
  for (var x=0; x<libraries.length; x++) {
    lib_name = libraries[x];
    option = document.createElement('option');
    option.value = lib_name;
    option.text = lib_name;
    libraries_selector.appendChild(option);
  }
}

function makeRequest(url, callback) {
  const httpRequest = new XMLHttpRequest();
  
  function responseParser() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = JSON.parse(httpRequest.responseText);
        callback(response);
      } /*else {
        alert('There was a problem with the request.');
      }*/
    }
  }
  
  httpRequest.onreadystatechange = responseParser;
  httpRequest.open('GET', url);
  httpRequest.send();
}

function divclick(element) {
  window.location.href=element.getAttribute('data-library') + '/book/'+ element.getAttribute('data-bookid');
}
