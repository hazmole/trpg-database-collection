var SorterUtils = {};

SorterUtils.compareTalent = function(list){
  return function(a, b) {
    if(a.type != b.type) return list.indexOf(a) - list.indexOf(b);
    if(a.isLimit != b.isLimit) return (a.isLimit - b.isLimit);
    return list.indexOf(a) - list.indexOf(b);
  };
};
