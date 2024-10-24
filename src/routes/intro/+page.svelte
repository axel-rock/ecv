<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<h1>Axel Rock</h1>

<h2>Lead front-end dev</h2>

<ul>
	<li>J'ai fait les Gobelins, mais mon diplôme a brûlé.</li>
	<li>Expert dans les publicités que tout le monde déteste sur les sites web.</li>
	<li><a href="//thinkeo.io" target="_blank">Thinkeo</a> le jour</li>
	<li><a href="//persocoms.ai" target="_blank">Persocoms</a> la nuit</li>
</ul>

<p>Twitter: @axlrck</p>

<style>
	p,
	ul {
		font-size: 1.1em;
	}
	ul {
		padding: 0;

		display: grid;
		gap: 0.5rem;
		color: var(--grey-900);
	}
</style>
