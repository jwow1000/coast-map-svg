export function getInfo() {
  // get the cms data from the webflow page collections item
  const cmsItems = document.querySelectorAll('.cms-body-text');
  console.log("cms", cmsItems) 
  // Initialize an array to hold all the stories
  const allItems = [];

  // Loop through each script tag and parse the JSON data
  cmsItems.forEach( item => {
    
    // create the object
    const obj = {
      title: item.getAttribute('data-title'),
    }

    allItems.push( obj );
    
    
  });


  return allItems
}

