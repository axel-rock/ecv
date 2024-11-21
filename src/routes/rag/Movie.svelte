<script lang="ts">
	type Movie = {
		'1': string // title
		year: number
		cast?: string[]
		extract?: string
		genres?: string[]
		href?: string
		thumbnail?: string
		thumbnail_height?: number
		thumbnail_width?: number
	}

	type Props = {
		score: number
		metadata: Movie
	}

	const { score, metadata }: Props = $props()

	const movie = metadata
</script>

<article>
	<h1 style="grid-area: title;">{movie[1]}</h1>
	<span class="date" style="grid-area: year;">{movie.year}</span>

	<span class="score" style="grid-area: score;"
		>{new Intl.NumberFormat(undefined, {
			style: 'percent',
		}).format(score)}</span
	>

	{#if movie.thumbnail}
		<img src={movie.thumbnail} alt="" style="grid-area: thumbnail;" />
	{/if}

	<div style="grid-area: extract;">
		<p>{movie.extract}</p>
		{#if movie.cast}
			<p>
				With {new Intl.ListFormat('en', {
					style: 'long',
					type: 'conjunction',
				}).format(movie.cast)}
			</p>
		{/if}
		{#if movie.genres}
			<p>
				<b>Genres</b>: {new Intl.ListFormat('en', {
					style: 'long',
					type: 'conjunction',
				}).format(movie.genres)}
			</p>
		{/if}
	</div>
</article>

<style>
	article {
		padding: 1rem;
		display: grid;
		align-items: flex-start;
		justify-content: flex-start;
		grid-template-areas:
			'title year score'
			'extract extract thumbnail';
		grid-template-columns: max-content 1fr max-content;
		gap: 1rem;

		h1,
		span {
			align-self: first baseline;
		}

		span.score {
			justify-self: end;
		}

		img {
			max-width: 10rem;
		}
	}
</style>
