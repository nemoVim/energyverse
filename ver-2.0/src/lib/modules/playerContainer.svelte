<script>
    import { checkTech, techNameList } from '$lib/classes/tech';

    export let game;

    let limitTimeList = [120, 120, 120, 120, 120, 120];

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
        <div class="playerDiv" class:turn={i === game.turn}>
            <p>{game.title}{i + 1} / {limitTimeList[i]}초</p>
            <p>{player.energy}E/{player.energyStorage}E (+{player.earn}E)</p>
            <p>유닛 {player.unitList.length}개/{player.unitStorage}개</p>
            <!-- <p>units: {JSON.stringify(player.units)}</p>
            <p>buildings: {JSON.stringify(player.buildings)}</p>
            <p>tech: {JSON.stringify(player.tech)}</p> -->
            <hr>
            <ul>
            {#each techNameList as techName, i}
                {#if i !== 0 && i !== 1 && checkTech(player.tech, i)}
                    <li>{techName}</li>
                {/if}
            {/each}
            </ul>
        </div>
    {/each}
</div>

<style>

    ul {
        padding-left: 1rem;
        font-size: .9rem;
        margin: 0;
    }

    #playerContainer {
        position: fixed;
        left: 0;
        top: 0;
        display: flex;
        flex-wrap: wrap;
        width: 38%;
        padding: .5rem;
    }

    .turn {
        background-color: rgba(240, 240, 255, 0.9) !important;
    }

    .playerDiv {
        flex: 1 0 20%;
        border: black 0.2rem solid;
        border-radius: 0.5rem;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 1rem;
        margin: .5rem;
    }

    .playerDiv > p {
        margin-bottom: .5rem;
        margin-top: 0;
    }
</style>
