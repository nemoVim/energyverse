<script>
    export let game;
</script>

<div id="playerContainer">
    {#each game.playerList as player}
        <div class="playerDiv">
            <p>index: {player.index}</p>
            <p>energy: {player.energy}/{player.energyStorage}</p>
            <p>unit: {player.unitList.length}/{player.unitStorage}</p>
            <p>earn: {player.earn}</p>
            <p>units: {JSON.stringify(player.units)}</p>
            <p>buildings: {JSON.stringify(player.buildings)}</p>
            <p>tech: {JSON.stringify(player.tech)}</p>
        </div>
    {/each}
</div>

<style>
    #playerContainer {
        display: flex;
        flex-direction: column;
    }

    .playerDiv {
        border: black 0.2rem solid;
        border-radius: 0.3rem;
        background-color: white;
        padding: 1rem;
        margin: 1rem;
    }
</style>
