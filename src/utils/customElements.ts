(() => {
	const definedCustomElements = new Set<string>();
	const originalDefine = CustomElementRegistry.prototype.define;

	// Override the define method
	CustomElementRegistry.prototype.define = function (name, cs, options) {
		// Record the name before calling the original define
		definedCustomElements.add(name);
		console.log(`Custom Element Defined: ${name}`);

		// Call the original define method
		// Use `Reflect.apply` or `originalDefine.apply(this, arguments)`
		// to correctly pass context and arguments.
		return Reflect.apply(originalDefine, this, [name, cs, options]);
	};

	// Expose a way to get the defined elements
	window.getDefinedCustomElements = () => definedCustomElements;

	// You can also add an event listener for "DOMContentLoaded"
	// or a specific load event if you want to log them once the page is ready.
	document.addEventListener("DOMContentLoaded", () => {
		console.log(
			"All Custom Elements defined so far (after patch applied):",
			window.getDefinedCustomElements(),
		);
	});
})();
