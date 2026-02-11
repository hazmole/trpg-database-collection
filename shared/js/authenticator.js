const MyAuth = {
	pwdColle: {
		kamigakari: "kamigakari",
	},

	run: function() {
		if(!isAtAuthPage()){
			if (!isAuthPass()) {
				goToAuthPath();
			}
		}

		// ==================
		function getRootFolder() {
			const portion = window.location.href.split('/');
			return portion[portion.length-2];
		}
		function isAtAuthPage(){
			return window.location.href.match(/auth\.html/)!=null;
		}
		function isAuthPass() {
			const key = getRootFolder();
			var status = localStorage.getItem(`${key}-auth-status`);
			return (!!status);
		}

		function goToAuthPath() {
			const key = getRootFolder();
			window.location.replace(`../auth.html?system=${key}`);
		}
	},

	auth: function(systemKey, inputVal) {
		const pwd = (this.pwdColle[systemKey] || undefined);
		if (pwd === undefined) {
			// Return errorCode: invalid systemKey
			return "invalid system";
		} else if (pwd !== inputVal) {
			// Return errorCode: incorrect password
			return "authenticate failed";
		} else {
			// Goto Index.html
			localStorage.setItem(`${systemKey}-auth-status`, true);
			window.location.replace(`./${systemKey}/index.html`);
			return "";
		}
	},

	getSystemName: function(systemKey) {
		switch(systemKey) {
			case "kamigakari": return "神我狩";
		}
		return undefined;
	},
};

MyAuth.run();
