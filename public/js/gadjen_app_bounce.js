// const rootElement = document.getElementById('AddToCartForm--product-template');
// const element = document.createElement('div');

// element.textContent = 'True Stick';
// element.className = 'gadjen-container';

// rootElement.appendChild(element);

(function () {
	var getCurrentScript = function () {
	  if (document.currentScript) {
	    return document.currentScript.src;
	  } else {
	    var scripts = document.getElementsByTagName('script');
	    return scripts[scripts.length-1].src;

	  }
	};
	// -- Get path --
	// var getCurrentScriptPath = function () {
	//   var script = getCurrentScript();
	//   var path = script.substring(0, script.lastIndexOf('/'));
	//   return path;
	// };
	console.log(getCurrentScript());
	function getParameterByName(name, url) {
	    if (!url) url = getCurrentScript();
	    name = name.replace(/[\[\]]/g, '\\$&');
	    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	const selectedEffect = getParameterByName('effect');
	const selectedInterval = getParameterByName('interval');

	const shake = '@keyframes shake {0% {left: 0}1% {left: -3px}2% {left: 5px}3% {left: -8px}4% {left: 8px}5% {left: -5px}6% {left: 3px}7% {left: 0}}';
	const bounce = '@keyframes bounce {0% {transform: scale(1,1) translate(0px, 0px);}1% {transform: scale(1,0.8) translate(0px, 10px);}2% {transform: scale(1,1.1) translate(0px, -15px);}3% {transform: scale(1,1) translate(0px, 5px);}4% {transform: scale(1,1) translate(0px, 5px);}5% {transform: scale(1,0.8) translate(0px, 10px);}6% {transform: scale(1,1.1) translate(0px, -15px);}7% {transform: scale(1,1) translate(0px, 0px);}}';
	const wobble = '@keyframes wobble {0% {-webkit-transform: translateX(3px) rotate(2deg);transform: translateX(3px) rotate(2deg);}1% {-webkit-transform: translateX(-3px) rotate(-2deg);transform: translateX(-3px) rotate(-2deg);}2% {-webkit-transform: translateX(3px) rotate(2deg);transform: translateX(3px) rotate(2deg);}3% {-webkit-transform: translateX(-3px) rotate(-2deg);transform: translateX(-3px) rotate(-2deg);}4% {-webkit-transform: translateX(2px) rotate(1deg);transform: translateX(2px) rotate(1deg);}5% {-webkit-transform: translateX(-2px) rotate(-1deg);transform: translateX(-2px) rotate(-1deg);}6% {-webkit-transform: translateX(2px) rotate(1deg);transform: translateX(2px) rotate(1deg);}7% {-webkit-transform: translateX(-2px) rotate(-1deg);transform: translateX(-2px) rotate(-1deg);}8% {-webkit-transform: translateX(1px) rotate(0);transform: translateX(1px) rotate(0);}9% {-webkit-transform: translateX(-1px) rotate(0);transform: translateX(-1px) rotate(0);}}';

	const effectStyle = '#AddToCart--product-template {animation-name: '+selectedEffect+';animation-duration:'+selectedInterval+'s;animation-iteration-count: infinite;animation-timing-function: ease-in;position:relative}';

	var style = $("<style />", {
		html: ''+shake+bounce+wobble+effectStyle+ ''
	}).appendTo("head");

}());