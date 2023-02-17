<script>
    import { Game } from '$lib/classes/game';
    import BtnContainer from '$lib/modules/btnContainer.svelte';
    import BulidTileContainer from '$lib/modules/bulidTileContainer.svelte';
    import MoveTileContainer from '$lib/modules/moveTileContainer.svelte';
    import PlayerContainer from '$lib/modules/playerContainer.svelte';
    import ProduceTileContainer from '$lib/modules/produceTileContainer.svelte';
    import WorldTileContainer from '$lib/modules/worldTileContainer.svelte';

    export let data;

    let game = new Game(data.game)

    $: {
        console.log(game);
    }

    function previousTurn() {
        game.previousTurn();
        game = new Game(game.gameObj);
    }

    function nextTurn() {
        game.nextTurn();
        game = new Game(game.gameObj);
    }

    let clickedUnit;

    let clickedBuildEn;
    let clickedProduceEn;

    function clickedBuild(event) {
        clickedProduceEn = null;
        clickedUnit = null;
        clickedBuildEn = event.detail.buildEn;
    }

    function clickedProduce(event) {
        clickedBuildEn = null;
        clickedUnit = null;
        clickedProduceEn = event.detail.produceEn;
    }

    function clickAir(event) {
        clickedBuildEn = null;
        clickedProduceEn = null;
        clickedUnit = null;
    }

    function clickUnit(event) {
        clickedBuildEn = null;
        clickedProduceEn = null;
        clickedUnit = event.detail.unit;
    }

    function refreshGame(event) {
        game = new Game(event.detail.game);
    }


</script>

<h1>{game.title}</h1>

<hr />

<p>Round: {game.round}</p>
<p>Turn: {game.turn}</p>
<p>First: {game.first}</p>

<button on:click={previousTurn}>이전 턴</button>
<button on:click={nextTurn}>다음 턴</button>

<hr />

<BtnContainer on:build={clickedBuild} on:produce={clickedProduce}/>

<div id="gameContainer">

    <div id="tileContainer">
        <div>
            <WorldTileContainer {game} on:air={clickAir} on:move={clickUnit} on:game={refreshGame}/>
            <MoveTileContainer game={game} clickedUnit={clickedUnit} on:game={refreshGame}/>
            <BulidTileContainer game={game} clickedBuildEn={clickedBuildEn} on:game={refreshGame}/>
            <ProduceTileContainer game={game} clickedProduceEn={clickedProduceEn} on:game={refreshGame}/>
        </div>
    </div>

    <PlayerContainer {game} />

</div>

<style>
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
