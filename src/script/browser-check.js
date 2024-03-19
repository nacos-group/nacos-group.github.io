
	// 检查是否是高版本浏览器
function checkBrowserVersion() {
  const userAgent = navigator.userAgent;
  let chromeMatch = userAgent.match(/Chrom(e|ium)\/(\d+)\./);
  let safariMatch = userAgent.match(/Version\/(\d+).*Safari/);


  if (chromeMatch && parseInt(chromeMatch[2], 10) >= 90) {
    console.log('Chrome browser version is 90 or above');
  } else if (safariMatch && parseInt(safariMatch[1], 10) > 13) {
    console.log('Safari browser version is above 13');
  } else {
    window.location.href = 'zh-cn';
    console.log('Browser version check: non-compliant or unknown browser');
  }
}


  window.addEventListener('load', checkBrowserVersion);