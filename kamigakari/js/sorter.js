var Sorter = {};

Sorter.talentCmpFunc = function(a, b){
  if(a.type != b.type) return TALENTS.indexOf(a) - TALENTS.indexOf(b);
  if(a.isLimit != b.isLimit) return (a.isLimit - b.isLimit);
  return TALENTS.indexOf(a) - TALENTS.indexOf(b);
};
