var SorterUtils = {};

SorterUtils.compareTalent = function(list){
	return function(a, b) {
		if(a.type != b.type) return list.indexOf(a) - list.indexOf(b);
		if(a.isLimit != b.isLimit) return (a.isLimit - b.isLimit);
		return list.indexOf(a) - list.indexOf(b);
	};
};

SorterUtils.compareCustom = function(list, refFactory, keyOrder) {
	return function(a, b) {
		const aRef = refFactory(a);
		const bRef = refFactory(b);
		for(let i=0; i<keyOrder.length; i++) {
			const key = keyOrder[i];
			if (aRef[key] != bRef[key]) return (aRef[key] > bRef[key]? 1: -1);
		}
		return list.indexOf(a) - list.indexOf(b);
	}
}