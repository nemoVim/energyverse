<script>
    import { Tilemap } from '$lib/classes/tilemap';
    import tile from '$lib/assets/tile.png';
    import { getPositionStyle } from '$lib/utils/posFunctions';
    import { createEventDispatcher } from 'svelte';
    import { checkTech } from '$lib/classes/tech';
    import { Building } from '$lib/classes/buildings';
    import { Unit } from '$lib/classes/units';

    export let game;
    export let clickedUnit = null;
    $: validMovePosList = makeValidMovePosList(clickedUnit);

    const dispatch = createEventDispatcher();

    function changeGame() {
        dispatch('game', {
            game: game.gameObj,
        });
    }

    function makeValidMovePosList(unit) {
        if (unit === null) return [];

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
                posList = posList.concat([Tilemap.move(pos, j, 1)]);
            });
            console.log(posList);
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

            const nowPlayer = game.playerList[game.turn];

            if (
                biome.en === 'mountain' &&
                unit.en === 'probe' &&
                !checkTech(nowPlayer.tech, 0)
            )
                return false;
            if (
                biome.en === 'mountain' &&
                unit.en !== 'probe' &&
                !checkTech(nowPlayer.tech, 3)
            )
                return false;
            if (
                biome.en === 'water' &&
                unit.en === 'probe' &&
                !checkTech(nowPlayer.tech, 1)
            )
                return false;
            if (
                biome.en === 'water' &&
                unit.en !== 'probe' &&
                !checkTech(nowPlayer.tech, 2)
            )
                return false;

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
        let entity = game.world.getEntity(pos);
        if (entity !== null) {
            if (entity instanceof Building) {
                game.playerList[unit.player].energy += entity.cost - 5;
                game.buildingList.splice(game.buildingList.indexOf(entity), 1);
            } else if (entity instanceof Unit) {
                game.unitList.splice(game.unitList.indexOf(entity), 1);
            }

            if (unit.en === 'missile') {
                game.unitList.splice(game.unitList.indexOf(unit), 1);
            } else {
                unit.pos = pos;
            }
        } else {
            unit.pos = pos;
        }
        validMovePosList = [];
        changeGame();
    }
</script>

{#each validMovePosList as pos, i}
    {#if i !== 0}
        <button
            class="tile move"
            style={getPositionStyle(pos)}
            on:click={() => clickToMove(validMovePosList[0], pos)}
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

    .move > img {
        width: 2rem;
        margin: 0.433rem 0.5rem;
    }
</style>
