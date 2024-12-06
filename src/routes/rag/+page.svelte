<script lang="ts">
	import type { PageData } from './$types'
	import Movie from './Movie.svelte'

	// @ts-expect-error
	let { form }: PageData = $props()
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

<h2>Step 3: Compare vector / Search</h2>

<form action="?/query" method="POST">
	<input type="search" name="needle" id="needle" placeholder="What are you looking for?" />
	<button type="submit">Search</button>
</form>

{#if form?.search_result}
	<div class="results">
		{#each form.search_result as result}
			<Movie {...result} />
		{/each}
	</div>
{/if}

<h2>Step 4: Generate prompt</h2>

<form action="?/ask" method="POST">
	<input type="search" name="question" id="question" placeholder="Ask me anything" />
	<button type="submit">Search</button>
</form>

<h3>Answer</h3>

{#if form?.prompt}
	<details>
		<summary>Prompt</summary>
		<pre>
{form.prompt}
	</pre>
	</details>
{/if}

{#if form?.answer}
	<p><b>{@html form.answer}</b></p>
{/if}

{#if form?.search_results}
	<div class="results">
		{#each form.search_results as result}
			<Movie {...result} />
		{/each}
	</div>
{/if}
