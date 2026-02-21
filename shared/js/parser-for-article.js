class ArticleParser {

	constructor() {
		// initialize
		this.MOBILE_WIDTH = 900;
		this.elemColle = {};
	}

	build(docJsonData, tocDepth = 2) {
		// fetch Element from document
		this.elemColle.main         = document.getElementById("ArticleContainer");
		this.elemColle.toc          = document.getElementById("TocContainer");
		this.elemColle.tocToggleBtn = document.getElementById("TocToggleBtn");

		// Render
		this._initTocToggleBtn();
		this._renderToc(docJsonData, tocDepth);
		this._renderMainContent(docJsonData);
	}

	_initTocToggleBtn() {
		this.elemColle.tocToggleBtn.addEventListener('click', () => {
			this.elemColle.toc.classList.toggle('active');
		});
		this.elemColle.main.addEventListener('click', () => {
			if (window.innerWidth <= this.MOBILE_WIDTH) {
				this.elemColle.toc.classList.remove('active');
			}
		});
	}

	_renderToc(docJsonData, tocDepth) {
		const arr = [];
		docJsonData.filter( itemObj => itemObj.type == "section" ).forEach( (sectionObj, idx) => {
			if (sectionObj.title) {
				const title = sectionObj.title;
				arr.push(`<div><a href="#tag_h2_${title}">${title}</a></div>`);
			}
			sectionObj.entries.filter( itemObj => itemObj.type == "section" ).forEach( (sectionObj, idx) => {
				if (sectionObj.title) {
					const title = sectionObj.title;
					arr.push(`<div>．<a href="#tag_h3_${title}">${title}</a></div>`);
				}
				if (tocDepth >= 3) {
					sectionObj.entries.filter( itemObj => itemObj.type == "section" ).forEach( (sectionObj, idx) => {
						if (sectionObj.title) {
							const title = sectionObj.title;
							arr.push(`<div>　 <a href="#tag_h4_${title}">${title}</a></div>`);
						}
					});
				}
			});
		});

		this.elemColle.toc.innerHTML = arr.join("");
	}

	_renderMainContent(docJsonData) {
		this.elemColle.main.innerHTML = `<div id="Articles">${
			ArticleParser.Parse(docJsonData).join("")
		}</div>`;
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
					case "flowchart": return this.handleFlowChart(entry);
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
		var fmtText = item.replace(/\n/g, '<br/>');
		fmtText = ArticleParser.replaceLinkInString(fmtText);

		return `<p>${fmtText}</p>`;
	}
	static replaceLinkInString(text) {
		const regexp = /\{\@link\|(.*?)\}/gm;
		const resultArr = [...text.matchAll(regexp)];

		var fmtText =  text;
		resultArr.forEach( result => {
			const parts = result[1].split('|');
			const linkText = parts[0];
			const linkPid = parts[1];
			
			fmtText = fmtText.replace(result[0], `<a href="?pid=${linkPid}">${linkText}</a>`);
		});
		return fmtText;
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
		if(item.title){
			ret.push(`<div><b>${item.title}</b></div>`);
		}
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
		// ReqField: rows, colStyles, (caption), (bodyClass), (bodyStyle), (withoutHeader)
		var rowArr = [];
		var columeCount = item.colStyles.length;

		if(item.caption){
			rowArr.push(`<tr><th class="caption" colspan="${columeCount}">${item.caption}</th></tr>`);
		}
		item.rows.forEach( (row, rIdx) => {
			if(rIdx==0 && row.length==1 && row[0]=="") return ;

			const isHeader = (rIdx == 0 && !item.withoutHeader);
			const tag    = (isHeader)? "th": "td";
			const rClass = (isHeader)? "header": "";

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
		// ReqField: (title), entries
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
	static handleFlowChart(item) {
		// ReqField: entries, (bodyStyle)
		const bodyStyle = item.bodyStyle || "";
		const retArr = [];
		for(var entry of item.entries) {
			retArr.push(`<div class="flowChartSection" style="${bodyStyle}">${this.handleEntry(entry, 3)}</div>`);
		}
		return `<div class="flowChartContainer">${retArr.join('<div class="flowChartSpliter">▼</div>')}</div>`;
	}

	//====================
	static getTitleElem(txt, depth){
		switch(depth){
		case 1: return `<h2 id="tag_h2_${txt}">${txt}</h2>`;
		case 2: return `<h3 id="tag_h3_${txt}">${txt}</h3>`;
		case 3: return `<h4 id="tag_h4_${txt}">${txt}</h4>`;
		case 4: return `<h5>${txt}</h5>`;
		default:
			return `<h6>${txt}</h6>`;
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
