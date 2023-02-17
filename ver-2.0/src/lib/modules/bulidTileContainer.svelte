<script>
    import { createBuilding } from '$lib/classes/buildings';
    import spawn from '$lib/assets/spawn.png';
    import { getPositionStyle } from '$lib/utils/posFunctions';


    export let clickedBuildEn = '';

    $: validBuildPosList = makeValidBuildPosList(clickedBuildEn);

    function makeValidBuildPosList(buildingEn) {
        validMovePosList = [];
        validBuildPosList = [];
        validProducePosList = [];
        let posList = [buildingEn];
        game.playerList[game.turn].unitList.forEach((unit) => {
            if (unit.en !== 'probe') return;

            Tilemap.ring(unit.pos, 1).forEach((pos) => {
                if (game.world.getBiome(pos).en === 'fuel') return;
                if (game.world.getEntity(pos) !== null) return;

                posList.push(pos);
            });
        });
        validBuildPosList = posList;
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
        game = new Game(game.gameObj);
    }
</script>

{#each validBuildPosList as pos, i}
    {#if i !== 0}
        <button
            class="tile build"
            style={getPositionStyle(pos)}
            on:click={() => clickToBuild(validBuildPosList[0], pos)}
        >
            <img src={spawn} alt="alt" />
        </button>
    {/if}
{/each}

<style>
    .build > img {
        width: 1rem;
        margin: 1rem;
    }
</style>
