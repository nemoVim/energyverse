<script>
    import { Tilemap } from '$lib/classes/tilemap';
    import spawn from '$lib/assets/spawn.png';
    import { getPositionStyle } from '$lib/utils/posFunctions';

    export let clickedUnit;
    $: validMovePosList = makeValidMovePosList(clickedUnit);

    function makeValidMovePosList(unit) {
        let posList = [unit];

        if (unit.en === 'probe') {
            posList = posList.concat(Tilemap.ring(unit.pos, 1));
            posList = posList.concat(Tilemap.ring(unit.pos, 2));
        } else if (unit.en === 'windUnit') {
            for (let i = 0; i < 6; i++) {
                posList = posList.concat([Tilemap.move(unit.pos, i, 1)]);
                posList = posList.concat([Tilemap.move(unit.pos, i, 2)]);
            }
        } else if (unit.en === 'solarUnit') {
            posList = posList.concat(Tilemap.ring(unit.pos, 1));
            Tilemap.ring(unit.pos, 1).forEach((pos, i) => {
                let j = i - 1;
                if (j < 0) j = 5;
                posList = posList.concat(Tilemap.move(pos, j, 1));
            });
        } else if (unit.en === 'atomicUnit') {
            posList = posList.concat(Tilemap.ring(unit.pos, 2));
        } else if (unit.en === 'missile') {
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 25; j++) {
                    posList = posList.concat([Tilemap.move(unit.pos, i, j)]);
                }
            }
        }

        posList = posList.filter((pos, i) => {
            if (i === 0) {
                return true;
            }

            if (game.turn !== unit.player) {
                return false;
            }

            if (
                Math.abs(pos[0]) >= game.world.size - 1 ||
                Math.abs(pos[1]) >= game.world.size - 1 ||
                Math.abs(pos[2]) >= game.world.size - 1
            ) {
                return false;
            }

            const biome = game.world.getBiome(pos);

            if (biome === null) {
                return false;
            }

            if (game.world.getBiome(pos).en === 'fuel') {
                return false;
            }

            const entity = game.world.getEntity(pos);

            if (entity !== null) {
                if (entity.player === unit.player || unit.en === 'probe') {
                    return false;
                }
            }

            return true;
        });

        return posList;
    }

    function clickToMove(unit, pos) {
        unit.pos = pos;
        let entity = game.world.getEntity(pos);
        if (entity !== null) {
            game.playerList[unit.player].energy += entity.cost - 5;
            game.unitList.splice(game.unitList.indexOf(entity), 1);
        }
        validMovePosList = [];
        game = new Game(game.gameObj);
    }
</script>

{#each validMovePosList as pos, i}
    {#if i !== 0}
        <button
            class="tile move"
            style={getPositionStyle(pos)}
            on:click={() => clickToMove(validMovePosList[0], pos)}
        >
            <img src={spawn} alt="alt" />
        </button>
    {/if}
{/each}

<style>
    .move > img {
        width: 1rem;
        margin: 1rem;
    }
</style>