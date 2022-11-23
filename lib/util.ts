export const randomAssign = (pplArray: string[]) : string[][] => {
  
  const assignedArr: string[][] = [];
  
  let arrCopy = [...pplArray];

  pplArray.forEach((el, idx, arr)=>{
    
    if (arrCopy.length > 0) {
      const b:string[] = arrCopy.filter(ce=>ce!==el);
      const randomIndex = Math.floor(Math.random()*b.length);
      if (b.length <= 2) {
        if (arr[arr.length-1] === b[0]) {
          assignedArr.push([el,b[0]]);
          arrCopy = arrCopy.filter((ce=>ce !== b[0]));
        } else if (arr[arr.length-1] === b[1]) {
          assignedArr.push([el,b[1]]);
          arrCopy = arrCopy.filter((ce=>ce !== b[1]));
        } else {
          assignedArr.push([el,b[randomIndex]])
          arrCopy = arrCopy.filter((ce=>ce !== b[randomIndex]));  
        }       
      } else {
        assignedArr.push([el,b[randomIndex]])
        arrCopy = arrCopy.filter((ce=>ce !== b[randomIndex]));
      }
      
    }
  })

  return assignedArr;
}