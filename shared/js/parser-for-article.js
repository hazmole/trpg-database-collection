export class ArticleParser {

	static ParserPlugin = {};

	constructor(cfg) {
		// initialize
		this.MOBILE_WIDTH = 900;
		this.elemColle = {
			main: cfg.mainElem,
			toc: cfg.tocElem,
			tocToggleBtn: cfg.tocBtnElem,
		};
	}

	build(docJsonData, tocDepth = 2) {
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
		this.elemColle.main.innerHTML = ArticleParser.Parse(docJsonData).join("");

		this.elemColle.main.querySelectorAll(".Image img").forEach(elem => {
			elem.addEventListener('click', () => {
				ArticleParser.renderLightboxOverlay(elem.src);
			});
		});
	}

	static renderLightboxOverlay(imgSrc) {
		const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
		overlay.innerHTML = `<span class="lightbox-close">&times;</span><img class="lightbox-img" src="${imgSrc}" alt="放大圖片">`;
		document.body.appendChild(overlay);
		setTimeout(() => {
			overlay.classList.add('active');
    }, 10);
		
		const closeLightbox = () => {
			overlay.classList.remove('active');
			setTimeout(() => {
				overlay.remove();
			}, 300);
    };
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) { closeLightbox(); }
    });
		const closeBtn = overlay.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
	}

	static register(key, parser) {
		this.ParserPlugin[key] = parser;
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
			case "number": return this.handleString(entry+"");
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
					case "custom":  return this.handleCustomParser(entry);
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
			
			if(linkPid.startsWith("http:") || linkPid.startsWith("https:")) {
				fmtText = fmtText.replace(result[0], `<a href="${linkPid}" target="_blank">${linkText}</a>`);
			} else {
				fmtText = fmtText.replace(result[0], `<a href="?pid=${linkPid}">${linkText}</a>`);
			}
		});
		return fmtText;
	}

	static handleImage(item) {
		// ReqField: url, (style)
		return `<div class="Image"><img src=${item.url} style="${item.style}"/></div>`;
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
		// ReqField: entries, (number)
		const tag = (item.number)? 'ol': 'ul';

		var ret = [];
		for(var entry of item.entries){
			ret.push(`<li>${this.handleEntry(entry, depth+1)}</li>`);
		}
		return `<${tag}>${ret.join('')}</${tag}>`;
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
		const bodyStyle = item.bodyStyle || "";
		// define recursive function
		const renderSequence = (sequence, isNestedBranch = false, isNoRemain = true) => {
			let retArr = [];

			sequence.forEach((node, index) => {
				const isFirst = (index === 0);
      	const isLast = (index === sequence.length - 1);

				if (isNestedBranch && isFirst) {
					retArr.push(`<div class="flowChartSpliter branchStart">▼</div>`);
				} else if (!isFirst) {
					retArr.push(`<div class="flowChartSpliter">▼</div>`);
				}

				if (node && typeof node === 'object' && node.branch) {
					// Branch
					const branchSegments = node.branch.map(subSeq => {
						return `<div class="flowChartBranch">${renderSequence(subSeq, true, isLast)}</div>`;
					});
					retArr.push(`<div class="flowChartSplitWrapper">${branchSegments.join('')}</div>`);
				} else {
					// Node
					retArr.push(`<div class="flowChartSection" style="${bodyStyle}">${this.handleEntry(node, 3)}</div>`);
				}

				if (isNestedBranch && isLast && !isNoRemain) {
					retArr.push(`<div class="flowChartSpliter branchEnd">▼</div>`);
				}
			});

			return retArr.join('');
		};

		const finalContent = renderSequence(item.entries, false, true);
		return `<div class="flowChartContainer">${finalContent}</div>`;
	}
	static handleCustomParser(item) {
		// ReqField: parser, datas
		if (!this.ParserPlugin[item.parser]) {
			console.error('找不到對應的 custom parser:', item.parser);
			return '';
		}

		const parserFunc = this.ParserPlugin[item.parser]
		const retArr = [];

		item.datas.forEach(data => {
			retArr.push(parserFunc(data, ArticleParser));
		});

		return `<div class="customDataList">${retArr.join('')}</div>`;
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
