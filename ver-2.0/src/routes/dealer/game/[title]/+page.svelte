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

        // game.turn = Game.rotate(game.turn, 0, 6, 1);
        // if (game.turn === game.first) {
        //     game.round += 1;
        // }

        game.nextTurn();

        game = new Game(game.gameObj);

        loading = false;
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

<h1>{game.title}</h1>

<hr />

<BtnContainer {game} on:build={clickedBuild} on:produce={clickedProduce} />

<div id="gameContainer">
    <div>
        <div>
            <p>Round: {game.round}</p>
            <p>Turn: {game.turn}</p>
            <p>Temp: {game.temp}</p>
            <p>First: {game.first}</p>

            <button on:click={previousTurn}>이전 턴</button>
            <button on:click={nextTurn}>다음 턴</button>
            <button on:click={gameStart}>시작</button>
            <button on:click={gameStop}>정지</button>
        </div>
        <div id="tileContainer">
            <div>
                <WorldTileContainer
                    {game}
                    on:air={clickAir}
                    on:move={clickUnit}
                    on:game={refreshGame}
                />
                <MoveTileContainer {game} {clickedUnit} on:game={refreshGame} />
                <BulidTileContainer
                    {game}
                    {clickedBuildObj}
                    on:game={refreshGame}
                />
                <ProduceTileContainer
                    {game}
                    {clickedProduceEn}
                    on:game={refreshGame}
                />
            </div>
        </div>
    </div>

    <PlayerContainer {game} />
</div>

<style>
    #loadingDiv {
        z-index: 100;
        display: flex;
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.4);
    }

    #loadingDiv > p {
        font-size: 10rem;
        color: white;
        text-shadow: rgb(50, 50, 50) 0 0.3rem 0.5rem;
    }

    #tileContainer {
        display: flex;
        justify-content: center;
        margin: 40rem;
    }

    #tileContainer > div {
        position: relative;
    }

    #gameContainer {
        display: flex;
    }
</style>
