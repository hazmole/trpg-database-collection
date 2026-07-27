var SorterUtils = {};

SorterUtils.compareBoons = function(list){
	return function(a, b) {
		const typeOrder = [ "輔助", "術式", "常駐" ];
		if(a.type != b.type) return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
		return list.indexOf(a) - list.indexOf(b);
	};
};

SorterUtils.compareItem = function(list) {
	const typeOrder = [ "常備品", "消耗品" ];
	return SorterUtils.compareCustom(list, (data) => {
		return {
			type: typeOrder.indexOf(data.type),
			cost: (data.cost == "-")? Math.max :data.cost,
		};
	}, ['type', 'cost']);
}

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