<script>
    import { AtomicPower, createBuilding } from '$lib/classes/buildings';
    import tile from '$lib/assets/tile.png';
    import { getPositionStyle } from '$lib/utils/posFunctions';
    import { Tilemap } from '$lib/classes/tilemap';
    import { createEventDispatcher } from 'svelte';
    import { checkTech } from '$lib/classes/tech';

    export let clickedBuildObj = null;
    export let game;

    $: validBuildPosList = makeValidBuildPosList(clickedBuildObj);

    const dispatch = createEventDispatcher();

    function changeGame() {
        dispatch('game', {
            game: game.gameObj,
        });
    }

    function makeValidBuildPosList(buildingObj) {
        if (buildingObj === null) {
            return [];
        } else {
            let posList = [buildingObj];
            const nowPlayer = game.playerList[game.turn];
            nowPlayer.unitList.forEach((unit) => {
                if (unit.en !== 'probe') return;

                Tilemap.ring(unit.pos, 1).forEach((pos) => {
                    if (game.world.getBiome(pos).en === 'fuel') return;
                    if (
                        game.world.getBiome(pos).en === 'mountain' &&
                        !checkTech(nowPlayer.tech, 3)
                    )
                        return;
                    if (
                        game.world.getBiome(pos).en === 'water' &&
                        !checkTech(nowPlayer.tech, 5)
                    )
                        return;
                    if (game.world.getEntity(pos) !== null) {
                        if (buildingObj.buildEn !== 'lab') return;
                        if (
                            game.world.getEntity(pos).track !==
                            buildingObj.labTrack
                        )
                            return;
                    } else if (buildingObj.buildEn === 'atomicPower') {
                        if (!AtomicPower.isBuildable(pos, game.world)) return;
                    }

                    posList.push(pos);
                });
            });
            return posList;
        }
    }

    function clickToBuild(buildingObj, pos) {
        let building;
        if (game.world.getEntity(pos) === null) {
            building = createBuilding({
                en: buildingObj.buildEn,
                track: buildingObj.labTrack,
                pos: pos,
                player: game.turn,
            });
            game.buildingList.push(building);
            game.playerList[game.turn].energy -= building.cost;
        } else if (game.world.getEntity(pos).en === 'lab') {
            building = game.world.getEntity(pos);
            game.playerList[game.turn].energy -= building.getUpgradeCost();
            building.floor += 1;
        }

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
        margin: 0.433rem 0.5rem;
    }
</style>
