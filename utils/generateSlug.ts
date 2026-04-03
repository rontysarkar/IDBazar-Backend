
const generateTitleSlug = (title:string, id:string) => {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w ]+/g, '') 
    .replace(/ +/g, '-');   
    
  return `${cleanTitle}-${id}`; 
};

const generateCategorySlug = (cat:string) => {
  const cleanTitle = cat
    .toLowerCase()
    .replace(/[^\w ]+/g, '') 
    .replace(/ +/g, '-');   
    
  return cleanTitle;
};

export {generateCategorySlug,generateTitleSlug}