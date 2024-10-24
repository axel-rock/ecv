<script lang="ts">
	import '/src/css/style.css'
</script>

<header class="narrow">
	<h1><a href="/">ECV M2 Dev</a></h1>
	<h2>IA Pratique et stratégie</h2>
</header>

<main class="narrow">
	<slot></slot>
</main>

<style>
	header {
		display: flex;
		align-items: first baseline;
	}
</style>
