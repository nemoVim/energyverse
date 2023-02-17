<script>
    import { createUnit } from '$lib/classes/units';
    import tile from '$lib/assets/tile.png';
    import { getPositionStyle } from '$lib/utils/posFunctions';
    import { createEventDispatcher } from 'svelte';
    import { Tilemap } from '$lib/classes/tilemap';

    export let game;
    export let clickedProduceEn = null;

    $: validProducePosList = makeValidProducePosList(clickedProduceEn);

    const dispatch = createEventDispatcher();

    function changeGame() {
        dispatch('game', {
            game: game.gameObj,
        });
    }

    function makeValidProducePosList(unitEn) {
        if (unitEn === null) {
            return [];
        } else {
            let posList = [unitEn];
            game.playerList[game.turn].buildingList.forEach((building) => {
                if (building.en !== 'factory') return;

                Tilemap.ring(building.pos, 1).forEach((pos) => {
                    if (game.world.getBiome(pos).en === 'fuel') return;
                    if (game.world.getEntity(pos) !== null) return;

                    posList.push(pos);
                });
            });
            return posList;
        }
    }

    function clickToProduce(unitEn, pos) {
        const unit = createUnit({
            en: unitEn,
            pos: pos,
            player: game.turn,
        });
        game.unitList.push(unit);
        game.playerList[game.turn].energy -= unit.cost;
        validProducePosList = [];
        changeGame();
    }
</script>

{#each validProducePosList as pos, i}
    {#if i !== 0}
        <button
            class="tile produce"
            style={getPositionStyle(pos)}
            on:click={() => clickToProduce(validProducePosList[0], pos)}
        >
            <img src={tile} alt="alt" />
        </button>
    {/if}
{/each}

<style>
    .tile {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        border: none;
        background-color: transparent;
        padding: 0;
        margin: 0;
    }

    .produce > img {
        width: 2rem;
        margin: .433rem .5rem;
    }
</style>
