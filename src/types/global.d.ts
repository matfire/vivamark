declare global {
	interface window {
		getDefinedCustomElements: () => Set;
	}
}
