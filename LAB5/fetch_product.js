fetch('product.json')
  .then( response => {
        return response.json();
  })
  .then( json => init(json) )
  .catch( err => console.error(`Fetch problem: ${err.message}`) );

function init(products) {
  const category = document.querySelector('#category');
  const searchTerm = document.querySelector('#searchTerm');
  const searchButton = document.querySelector('button');
  const main = document.querySelector('main');

  
  let lastCategory = category.value;
  let lastSearch = '';

  let categoryGroup;
  let finalGroup;

  finalGroup = products;
  updateDisplay();

  categoryGroup = [];
  finalGroup = [];

  searchButton.addEventListener('click', selectCategory);
  function selectCategory(selectc) {
    selectc.preventDefault();
    categoryGroup = [];
    finalGroup = [];

    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      
      if (category.value === 'All') {
        categoryGroup = products;
        selectProducts();
      
      } else {
        
        const lowerCaseType = category.value.toLowerCase();
        categoryGroup = products.filter( product => product.type === lowerCaseType );
        selectProducts();
      }
    }
  }

  
  function selectProducts() {
    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
    } else {
      const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      finalGroup = categoryGroup.filter( product => product.name.includes(lowerCaseSearchTerm));
    }
    updateDisplay();
  }

  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    if (finalGroup.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'Sorry we cannot find anything!';
      main.appendChild(para);
    } else {
      for (const product of finalGroup) {
        feBlob(product);
      }
    }
  }


  function feBlob(product) {
    const url = `${product.image}`;
    fetch(url)
      .then( response => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.blob();
      })
      .then( blob => showProduct(blob, product) )
      .catch( err => console.error(`Fetch problem: ${err.message}`) );
  }

  function showProduct(blob, product) {
    const objectURL = URL.createObjectURL(blob);
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    const para = document.createElement('p');
    const image = document.createElement('img');

    section.setAttribute('class', product.type);

 
    image.src = objectURL;
    image.alt = product.name;

    main.appendChild(section);
    
    section.appendChild(image);

   
      heading.textContent = product.name;
      para.textContent = product.price;
      
    

    section.appendChild(heading);
    section.appendChild(para);

    
  }

  
}

document.addEventListener('DOMConentLoaded', load);
window.onscroll = () =>{
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    load();
  }
}
function load(){
  const $ul = document.querySelector('ul');
  let $li;
  let count = 19999;
  $li = $ul.appendChild(document.createElement('li'));
  $li.textContent = ++count;
}




