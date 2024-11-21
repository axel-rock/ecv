<script lang="ts">
	import type { PageData } from './$types'

	let { data, form }: PageData = $props()
</script>

<h1>Rag</h1>

<h2>Step 1: Create vector</h2>

<form action="?/create" method="POST">
	<input type="text" name="prompt" placeholder="Convert text to vector" />
	<button type="submit">Create</button>
</form>

{#if form?.embedding}
	<details>
		<summary>Embedding</summary>
		<code>
			{JSON.stringify(form.embedding, null, 2)}
		</code>
	</details>
{/if}

<h2>Step 2: Store vector</h2>

<form action="?/store" method="POST">
	<input type="text" name="content" placeholder="Add vector to database" />
	<button type="submit">Add to database</button>
</form>

<h2>Step 2 bis: Import a database of movies</h2>

<form action="?/importMovies" method="POST">
	<button type="submit">Import all movies</button>
</form>

<h2>Step 3: Compare vector (Search)</h2>

<form action="?/search" method="POST">
	<input type="search" name="needle" id="needle" placeholder="What are you looking for?" />
	<button type="submit">Search</button>
</form>

<h2>Step 4: Generate prompt</h2>
