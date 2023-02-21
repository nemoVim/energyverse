<script>
    import { Game } from '$lib/classes/game';
    import BtnContainer from '$lib/modules/btnContainer.svelte';
    import BulidTileContainer from '$lib/modules/bulidTileContainer.svelte';
    import MoveTileContainer from '$lib/modules/moveTileContainer.svelte';
    import PlayerContainer from '$lib/modules/playerContainer.svelte';
    import ProduceTileContainer from '$lib/modules/produceTileContainer.svelte';
    import WorldTileContainer from '$lib/modules/worldTileContainer.svelte';
    import createGameObj from '$lib/utils/initialGameObj';
    import { postReq } from '$lib/utils/requests';

    export let data;

    let game = new Game(data.game);

    $: {
        console.log(game);
    }

    let loading = false;

    async function previousTurn() {
        loading = true;

        game.previousTurn();
        if (game.round === 0) {
            game = new Game(createGameObj(game.title));
        } else {
            const resMsg = await postReq(fetch, '/api/game/load', {
                title: game.title,
                round: game.round,
                turn: game.turn,
            });
            console.log(resMsg);
            game = new Game(resMsg);
        }

        loading = false;
    }

    async function nextTurn() {
        loading = true;

        console.log(game);
        // game.nextTurn();

        // game.turn = Game.rotate(game.turn, 0, 6, -1);
        // if (Game.rotate(game.turn, 0, 6, 1) === game.first) {
        //     game.round -= 1;
        // }

        const resMsg = await postReq(fetch, '/api/game/save', game.gameObj);
        const _resMsg = await postReq(fetch, '/api/game/save', game.gameObj);

        // game.turn = Game.rotate(game.turn, 0, 6, 1);
        // if (game.turn === game.first) {
        //     game.round += 1;
        // }

        game.nextTurn();

        game = new Game(game.gameObj);

        loading = false;
    }

    let isPlaying = false;

    $: {
        if (game.stop !== 0) {
            isPlaying = false;
        } else {
            isPlaying = true;
        }
    }

    async function gameStart() {
        loading = true;
        game.gameStart();
        game = new Game(game.gameObj);
        const resMsg = await postReq(fetch, '/api/game/save', game.gameObj);
        loading = false;
    }

    async function gameStop() {
        loading = true;
        game.gameStop();
        game = new Game(game.gameObj);
        console.log(game);
        const resMsg = await postReq(fetch, '/api/game/save', game.gameObj);
        loading = false;
    }

    let clickedUnit;

    let clickedBuildObj;
    let clickedProduceEn;

    function clickedBuild(event) {
        clickedProduceEn = null;
        clickedUnit = null;
        clickedBuildObj = {
            buildEn: event.detail.buildEn,
            labTrack: event.detail.labTrack,
        };
    }

    function clickedProduce(event) {
        clickedBuildObj = null;
        clickedUnit = null;
        clickedProduceEn = event.detail.produceEn;
    }

    function clickAir(event) {
        clickedBuildObj = null;
        clickedProduceEn = null;
        clickedUnit = null;
    }

    function clickUnit(event) {
        clickedBuildObj = null;
        clickedProduceEn = null;
        clickedUnit = event.detail.unit;
    }

    async function refreshGame(event) {
        loading = true;
        game = new Game(event.detail.game);
        const resMsg = await postReq(fetch, '/api/game/save', game.gameObj);
        loading = false;
    }
</script>

{#if loading}
    <div id="loadingDiv">
        <p>Loading...</p>
    </div>
{/if}

<BtnContainer {game} on:build={clickedBuild} on:produce={clickedProduce} />

<div id="infoContainer">
    <div>
        <p>
            ROOM_{game.title} / {game.temp.toFixed(1)} ℃ ({game.temp.toFixed(
                1
            ) + 15} ℃)
        </p>
        <hr />
        <p>Round {game.round} / {game.title}{game.turn + 1} Turn</p>
    </div>

    <button on:click={previousTurn}>이전 턴</button>
    <button on:click={nextTurn}>다음 턴</button>

    {#if isPlaying}
        <button on:click={gameStop}>정지</button>
    {:else}
        <button on:click={gameStart}>시작</button>
    {/if}
</div>

<div id="gameContainer">
    <div id="tileContainer">
        <WorldTileContainer
            {game}
            on:air={clickAir}
            on:move={clickUnit}
            on:game={refreshGame}
        />
        <MoveTileContainer {game} {clickedUnit} on:game={refreshGame} />
        <BulidTileContainer {game} {clickedBuildObj} on:game={refreshGame} />
        <ProduceTileContainer {game} {clickedProduceEn} on:game={refreshGame} />
    </div>
</div>

<PlayerContainer {game} />

<style>
    button {
        font-size: 1.8rem;
        padding: 0.6rem 1.8rem;
        margin: 0.5rem;
        background-color: rgba(255, 255, 255, 0.9);
        border: black solid 0.2rem;
        border-radius: 0.5rem;
    }

    button:hover {
        background-color: rgba(230, 230, 230, 0.9);
        cursor: pointer;
    }

    #loadingDiv {
        z-index: 100;
        display: flex;
        position: fixed;
        left: 0;
        top: 0;
        width: -webkit-fill-available;
        height: -webkit-fill-available;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.4);
    }

    #loadingDiv > p {
        font-size: 5rem;
        color: white;
        text-shadow: rgb(50, 50, 50) 0 0.3rem 0.5rem;
    }

    #infoContainer {
        display: flex;
        position: fixed;
        top: 0;
        left: 38%;
        z-index: 99;
        margin: 0.5rem;
    }

    #infoContainer > button {
        height: fit-content;
    }

    #infoContainer > div {
        background-color: rgba(255, 255, 255, 0.9);
        font-size: 1.2rem;
        border: solid black 0.2rem;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 0.5rem;
    }

    #infoContainer > div > p {
        margin: 0.5rem;
    }

    #gameContainer {
        width: 100vw;
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
        padding: 40rem;
    }

    #tileContainer {
        position: relative;
    }
</style>
