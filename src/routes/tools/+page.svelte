<script lang="ts">
	import type { PageData } from './$types'

	let { data, form }: { data: PageData; form: FormData } = $props()
</script>

<h1>Tools / Function calling</h1>

<h2>Raw request</h2>

<form action="?/raw" method="POST">
	<input type="text" name="content" id="content" />
	<button type="submit">Submit</button>
</form>

<h2>Vercel AI SDK</h2>

<form action="?/sdk" method="POST">
	<input type="text" name="content" id="content" />
	<button type="submit">Submit</button>
</form>

<div class="color" style="--color: {data.color ?? 'unset'}"></div>

{#if form && form}
	<pre>{JSON.stringify(form.response)}</pre>
{/if}

<style>
	.color {
		width: 4rem;
		aspect-ratio: 1;
		border: solid 1px currentColor;
		border-radius: 0.5rem;

		background-color: var(--color);
	}
</style>
