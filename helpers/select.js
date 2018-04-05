module.exports = function(selected, options) {
    if(selected && options && selected.toString() === options.toString()){
      return "selected";
    }else{
      return "";
    }
}