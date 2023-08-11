
exports.getDate = function (){

    let newDay  = new Date(); // Starting from here prepare to display dae in a specific format
    let options = { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long', 
       };
  
    
  return newDay.toLocaleDateString("en-US", options); // a way to display date in the said format
 

};


//More functions can be created underneath
//module.exports.NEW function = getDate; see updated version above
