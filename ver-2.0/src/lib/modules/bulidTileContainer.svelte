<script>
    import { createBuilding } from '$lib/classes/buildings';
    import tile from '$lib/assets/tile.png';
    import { getPositionStyle } from '$lib/utils/posFunctions';
    import { Tilemap } from '$lib/classes/tilemap';
    import { createEventDispatcher } from 'svelte';


    export let clickedBuildEn = null; 
    export let game;

    $: validBuildPosList = makeValidBuildPosList(clickedBuildEn);

    const dispatch = createEventDispatcher();

    function changeGame() {
        dispatch('game', {
            game: game.gameObj,
        });
    }

    function makeValidBuildPosList(buildingEn) {
        if (buildingEn === null) {
            return [];
        } else {
            let posList = [buildingEn];
            game.playerList[game.turn].unitList.forEach((unit) => {
                if (unit.en !== 'probe') return;

                Tilemap.ring(unit.pos, 1).forEach((pos) => {
                    if (game.world.getBiome(pos).en === 'fuel') return;
                    if (game.world.getEntity(pos) !== null) return;

                    posList.push(pos);
                });
            });
            return posList;
        }
    }

    function clickToBuild(buildingEn, pos) {
        const building = createBuilding({
            en: buildingEn,
            pos: pos,
            player: game.turn,
        });
        game.buildingList.push(building);
        game.playerList[game.turn].energy -= building.cost;
        validBuildPosList = [];
        changeGame();
    }
</script>

{#each validBuildPosList as pos, i}
    {#if i !== 0}
        <button
            class="tile build"
            style={getPositionStyle(pos)}
            on:click={() => clickToBuild(validBuildPosList[0], pos)}
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

    .build > img {
        width: 2rem;
        margin: .433rem .5rem;
    }
</style>
