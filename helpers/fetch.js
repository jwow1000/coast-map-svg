export function getInfo() {
  // get the cms data from the webflow page collections item
  const cmsItems = document.querySelectorAll('.cms-body-text');
  
  // Initialize an array to hold all the stories
  const allItems = [];

  // Loop through each script tag and parse the JSON data
  cmsItems.forEach( item => {
    // create the object
    const obj = {
      title: item.getAttribute('data-title'),
      body: item.getAttribute('data-body'),
      tags: item.getAttribute('data-tags'),
      idMatch: item.getAttribute('data-idMatch'),
      date: item.getAttribute('data-date'),
    }

    allItems.push( obj );
  });


  return allItems
}

