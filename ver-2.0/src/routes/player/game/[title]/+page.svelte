<script>
    import { browser } from '$app/environment';
    import { Game } from '$lib/classes/game';
    import { getReq } from '$lib/utils/requests';

    export let data;
    let game = new Game(data.game);

    async function longPolling() {
        try {
            const resMsg = await getReq(
                fetch,
                `/api/game/change?title=${game.title}`
            );
            console.log(resMsg);
            game = new Game(resMsg);
            console.log('end');
            await longPolling();
        } catch (e) {
            console.log('error');
            console.log(e);
            setTimeout(async () => {await longPolling()}, 1000);
        }
    }

    if (browser) {
        console.log('startPolling');
        longPolling();
    }
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
