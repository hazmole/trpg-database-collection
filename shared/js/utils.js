function loadScript(scriptPath, callback) {
    var script= document.createElement('script');
    script.setAttribute('src', scriptPath);
    script.onload = callback;
    document.head.appendChild(script);
};