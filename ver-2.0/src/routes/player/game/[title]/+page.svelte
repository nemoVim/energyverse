<script>
    import { Game } from '$lib/classes/game';

    export let data;
    const game = new Game(data.game);

</script>

<h1>{game.title}</h1>

<hr />

<p>Round: {game.round}</p>
<p>Turn: {game.turn}</p>
<p>First: {game.first}</p>

<hr />

{#each game.playerList as player}
    <div class="playerDiv">
        <p>index: {player.index}</p>
        <p>energy: {player.energy}</p>
        <p>storage: {player.storage}</p>
        <p>earn: {player.earn}</p>
        <p>units: {JSON.stringify(player.units)}</p>
        <p>buildings: {JSON.stringify(player.buildings)}</p>
        <p>tech: {JSON.stringify(player.tech)}</p>
    </div>
{/each}

<style>
    .playerDiv {
        border: black 0.1rem solid;
    }
</style>
