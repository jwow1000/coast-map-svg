export function getInfo() {
  // get the cms data from the webflow page collections item
  const infoScripts = document.querySelectorAll('.info-item');
  console.log("i", infoScripts);
  
  // Initialize an array to hold all the stories
  const allInfo = [];

  // Loop through each script tag and parse the JSON data
  infoScripts.forEach( script => {
    // console.log( script.textContent);
    const storyData = JSON.parse( script.textContent );
    
    allInfo.push( storyData );
  });


  return allInfo
}

