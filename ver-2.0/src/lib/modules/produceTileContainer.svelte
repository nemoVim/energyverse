<script>
    import { createUnit } from '$lib/classes/units';
    import spawn from '$lib/assets/spawn.png';
    import { getPositionStyle } from '$lib/utils/posFunctions';

    export let clickedProduceEn;

    $: validProducePosList = makeValidProducePosList(clickedProduceEn);

    function makeValidProducePosList(unitEn) {
        validMovePosList = [];
        validBuildPosList = [];
        validProducePosList = [];
        let posList = [unitEn];
        game.playerList[game.turn].buildingList.forEach((building) => {
            if (building.en !== 'factory') return;

            Tilemap.ring(building.pos, 1).forEach((pos) => {
                if (game.world.getBiome(pos).en === 'fuel') return;
                if (game.world.getEntity(pos) !== null) return;

                posList.push(pos);
            });
        });

        validProducePosList = posList;
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
        game = new Game(game.gameObj);
    }
</script>

{#each validProducePosList as pos, i}
    {#if i !== 0}
        <button
            class="tile produce"
            style={getPositionStyle(pos)}
            on:click={() => clickToProduce(validProducePosList[0], pos)}
        >
            <img src={spawn} alt="alt" />
        </button>
    {/if}
{/each}

<style>
    .produce > img {
        width: 1rem;
        margin: 1rem;
    }
</style>