class ArticleParser {
	static Build(elemID, docScript) {
		setTimeout(function() {
			const rootElem = document.getElementById(elemID);
			rootElem.append(htmlToNode(`<div id="Articles"></div>`))
			rootElem.append(htmlToNode(`<div><div id="QuickNav"></div></div>`));

			document.getElementById("Articles").innerHTML = ArticleParser.Parse(docScript).join("");
			document.getElementById("QuickNav").innerHTML = ArticleParser.ParseQuickNav(docScript).join("");
		}, 0);
	}

	static ParseQuickNav(docScript) {
	var arr = docScript.map( obj => obj.title ).filter( txt => txt!=null );
	return arr.map(txt=>`<div style="margin-bottom:5px;handleEntry"><a href="#tag_${txt}">${txt}</div>`);
}

	static Parse(docScript) {
		var outputArr = [];
		var depth = 1;

		docScript.forEach( entry => {
			outputArr.push( this.handleEntry(entry, depth) );
		});

		return outputArr;
	}

	static handleEntry(entry, depth) {
		switch(typeof entry){
			case "string": return this.handleString(entry);
			case "object":
				switch(entry.type){
					case "flex":    return this.handleFlex(entry, depth);
					case "section": return this.handleSection(entry, depth);
					case "list":    return this.handleList(entry, depth);
					case "table":   return this.handleTable(entry, depth);
					case "image":   return this.handleImage(entry);
					case "sidebar": return this.handleSidebar(entry, depth);
					case "note":    return this.handleNote(entry);
					default:
						console.error("Unknown entry type!", entry.type);
						return "";
				}
			default:
				console.error("Unknown entry!", entry);
				return "";
		}
	}

	//====================
	static handleString(item) {
		return `<p>${item.replace(/\n/g, '<br/>')}</p>`;
	}
	static handleImage(item) {
		// ReqField: url, (style)
		return `<img src=${item.url} style="${item.style}"/>`;
	}
	static handleNote(item) {
		// ReqField: text
		return `<p class="note">${item.text}</p>`;
	}
	static handleSidebar(item, depth) {
		// ReqField: entries
		var ret = [];
		for(var entry of item.entries){
			ret.push( this.handleEntry(entry, depth+1) );
		}
		return `<div class="sidebar">${ret.join('')}</div>`
	}
	static handleFlex(item, depth) {
		// ReqField: entries
		var ret = [];
		for(var entry of item.entries){
			ret.push( this.handleEntry(entry, depth+1) );
		}
		return `<div class="flexRow">${ret.join('')}</div>`;
	}
	static handleList(item, depth) {
		// ReqField: entries
		var ret = [];
		for(var entry of item.entries){
			ret.push(`<li>${this.handleEntry(entry, depth+1)}</li>`);
		}
		return `<ul>${ret.join('')}</ul>`;
	}
	static handleTable(item, depth) {
		// ReqField: (caption), rows, colStyles, (bodyStyle), (bodyStyle)
		var rowArr = [];
		var columeCount = item.colStyles.length;
		var rowCount = item.rows.length;

		if(item.caption){
			rowArr.push(`<tr><th class="caption" colspan="${columeCount}">${item.caption}</th></tr>`);
		}
		item.rows.forEach( (row, rIdx) => {
			if(rIdx==0 && row.length==1 && row[0]=="") return ;

			const tag   = (rIdx == 0)? "th": "td";
			const rClass = (rIdx == 0)? "header": "";

			var cellArr = [];
			row.forEach( (cell, cIdx, arr) => {
				var mergeSpan = (arr.length==1)? ` colspan=${columeCount}`: "";

				var cStyle = item.colStyles[cIdx];
				cellArr.push(`<${tag} style="${cStyle}" ${mergeSpan}>${this.handleEntry(cell, depth+1)}</${tag}>`);
			});

			rowArr.push(`<tr class="${rClass}">${cellArr.join('')}</tr>`);
		});

		return `<div class="dicTableOuter ${item.bodyClass}">
							<table class="docTable" style="${item.bodyStyle}">${rowArr.join('')}</table>
						</div>`;
	}
	static handleSection(item, depth) {
		// ReqField: (title), (entries)
		var ret = [];
		if(item.title != null){
			ret.push(this.getTitleElem(item.title, depth));
		}
		for(var entry of item.entries){
			ret.push(this.handleEntry(entry, depth+1));
		}
		
		var section = ret.join('');
		if(depth==1) return `<div class="section">${section}</div>`;
		else 				 return section;
	}


	//====================
	static getTitleElem(txt, depth){
		switch(depth){
		case 1: return `<h2 id="tag_${txt}">${txt}</h2>`;
		case 2: return `<h3>${txt}</h3>`;
		case 3: return `<h4>${txt}</h4>`;
		default:
			return `<h5>${txt}</h5>`;
		}
	}
}


function htmlToNode(html) {
	const template = document.createElement('template');
	template.innerHTML = html;

	const nNodes = template.content.childNodes.length;
	if (nNodes !== 1) {
		throw new Error(
			`html parameter must represent a single node; got ${nNodes}. ` +
			'Note that leading or trailing spaces around an element in your ' +
			'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
			'the element; call .trim() on your input to avoid this.'
		);
	}
	return template.content.firstChild;
}
