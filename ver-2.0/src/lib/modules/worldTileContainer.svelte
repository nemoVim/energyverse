<script>
    import spawn from '$lib/assets/spawn.png';
    import water from '$lib/assets/water.png';
    import ground from '$lib/assets/ground.png';
    import mountain from '$lib/assets/mountain.png';
    import fuel from '$lib/assets/fuel.png';
    import MoveTileContainer from './moveTileContainer.svelte';
    import { getPositionStyle } from '$lib/utils/posFunctions';

    export let game;

    const line = Array.from(
        { length: 2 * game.world.size - 1 },
        (v, i) => i - 13 + 1
    );

    function clickAir() {
        validMovePosList = [];
        validBuildPosList = [];
        validProducePosList = [];
    }

    function clickUnit(unit) {
        if (validMovePosList[0] !== unit) {
            validBuildPosList = [];
            validProducePosList = [];
            validMovePosList = makeValidMovePosList(unit);
        } else {
            validMovePosList = [];
        }
    }
</script>

        {#each line as x}
            {#each line as y}
                {#each line as z}
                    {#if x + y + z === 0}
                        {#if game.world.getBiome([x, y, z]).en === 'water'}
                            <button
                                class="tile"
                                style={getPositionStyle([x, y, z])}
                                on:click={clickAir}
                            >
                                <img src={water} alt="alt" />
                            </button>
                        {:else if game.world.getBiome( [x, y, z] ).en === 'ground'}
                            <button
                                class="tile"
                                style={getPositionStyle([x, y, z])}
                                on:click={clickAir}
                            >
                                <img src={ground} alt="alt" />
                            </button>
                        {:else if game.world.getBiome( [x, y, z] ).en === 'mountain'}
                            <button
                                class="tile"
                                style={getPositionStyle([x, y, z])}
                                on:click={clickAir}
                            >
                                <img src={mountain} alt="alt" />
                            </button>
                        {:else}
                            <button
                                class="tile"
                                style={getPositionStyle([x, y, z])}
                                on:click={() =>
                                    console.log(
                                        game.world.getBiome([x, y, z]).amount
                                    )}
                            >
                                <img src={fuel} alt="alt" />
                            </button>
                        {/if}
                    {/if}
                {/each}
            {/each}
        {/each}

        {#each game.playerList as player}
            {#each player.unitList as unit}
                <button
                    class="tile unit"
                    style={getPositionStyle(unit.pos)}
                    on:click={() => clickUnit(unit)}
                >
                    <p
                        style="position: absolute; color: black; font-weight: bold; text-align: center; margin: 0;"
                    >
                        {unit.kr}
                    </p>
                    <img src={spawn} alt="alt" />
                </button>
            {/each}

            {#each player.buildingList as building}
                <button
                    class="tile building"
                    style={getPositionStyle(building.pos)}
                >
                    <p
                        style="position: absolute; color: black; font-weight: bold; text-align: center; margin: 0;"
                    >
                        {building.kr}
                    </p>
                    <img src={spawn} alt="alt" />
                </button>
            {/each}
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

    .tile > img {
        width: 3rem;
    }

    .unit > img,
    .building > img {
        width: 2rem !important;
        margin: 0.5rem;
    }

</style>
