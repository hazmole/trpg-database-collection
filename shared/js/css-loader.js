function loadProjectStyle() {
  const isGitHub = window.location.hostname.includes('github.io');
  const folderName = window.location.pathname.split('/')[1];

  let cssPath = '';
  if (!isGitHub) {
    cssPath = `./css/main.css`;
  } else {
    cssPath = `./css/main.min.css`;
  }

  // 動態更新或創建 link 標籤
  let themeLink = document.getElementById('project-theme');
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.id = 'project-theme';
    themeLink.rel = 'stylesheet';
    document.head.appendChild(themeLink);
  }
  themeLink.href = cssPath;
}

loadProjectStyle();