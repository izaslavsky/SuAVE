var exports = module.exports;
var aboutOne = '<head><title>About Survey</title></head><h1 id="about-title">';
var aboutTwo = '</h1><p></p>';
var collections = ["default"];
var defaultCol = 0;

exports.getAbout = function(num){
  if(num == 1) {
    return aboutOne;
  }
  else if (num == 2) {
    return aboutTwo;
  }
};

exports.getDefaultCollect = function(){
  return collections[0];
};

exports.getDefaultCol = function(){
  return defaultCol;
}

exports.getCollections = function(){
  return collections;
};
