// import App from './App.svelte';

// const app = new App({
// 	target: document.body,
// 	props: {
// 		name: 'world'
// 	}
// });

// export default app;

import Counter from './Counter.svelte';
customElements.define('my-counter', Counter);

import Clock from './Clock.svelte';
customElements.define('my-clock', Clock);
