// const rootElement = document.getElementById('AddToCartForm--product-template');
// const element = document.createElement('div');

// element.textContent = 'True Stick';
// element.className = 'gadjen-container';

// rootElement.appendChild(element);

(function () {
	var rule = '@keyframes shake {0% {left: 0}1% {left: -3px}2% {left: 5px}3% {left: -8px}4% {left: 8px}5% {left: -5px}6% {left: 3px}7% {left: 0}} #AddToCart--product-template {animation-name: shake;animation-duration: 5s;animation-iteration-count: infinite;animation-timing-function: ease-in;position:relative}';

	var style = $("<style />", {
		html: '' + rule + ''
	}).appendTo("head");
}());