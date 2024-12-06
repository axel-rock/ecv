<script lang="ts">
	import { marked } from 'marked'
	import type { PageData } from './$types'

	let { data, form }: { data: PageData; form: FormData } = $props()
</script>

<h1>Multimodal (Text + Image)</h1>

<form method="POST" enctype="multipart/form-data">
	<input type="text" name="content" id="content" value="What's in the picture?" />
	<input type="file" name="file" id="file" accept="image/*" multiple />
	<button type="submit">Submit</button>
</form>

{#if form}
	<div>{@html marked(form.response)}</div>
{/if}
