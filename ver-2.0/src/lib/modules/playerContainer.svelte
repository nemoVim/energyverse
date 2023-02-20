<script>
    export let game;

    let limitTimeList = [30, 30, 30, 30, 30, 30];

    game.playerList.forEach((player, i) => {
        limitTimeList[i] = Math.floor(player.limit);
    });

    setInterval(() => {
        if (game.stop === 0) {
            const player = game.playerList[game.turn];
            limitTimeList[player.index] = Math.floor(player.limit);
        }
    }, 100);
</script>

<div id="playerContainer">
    {#each game.playerList as player, i}
        <div class="playerDiv">
            <p>index: {player.index} / {limitTimeList[i]}초</p>
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
