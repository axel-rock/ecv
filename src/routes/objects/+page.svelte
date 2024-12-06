<script lang="ts">
	import type { PageData } from './$types'

	let { data, form }: { data: PageData; form: FormData } = $props()
</script>

<h1>Generate objects</h1>

<form method="POST">
	<input type="text" name="content" id="content" />
	<button type="submit">Submit</button>
</form>

{#if form && form}
	<pre>{JSON.stringify(form.response)}</pre>
{/if}
