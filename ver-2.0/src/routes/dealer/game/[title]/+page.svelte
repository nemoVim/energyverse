<script>
    import { Game } from '$lib/classes/game';
    import BtnContainer from '$lib/modules/btnContainer.svelte';
    import BulidTileContainer from '$lib/modules/bulidTileContainer.svelte';
    import MoveTileContainer from '$lib/modules/moveTileContainer.svelte';
    import PlayerContainer from '$lib/modules/playerContainer.svelte';
    import ProduceTileContainer from '$lib/modules/produceTileContainer.svelte';
    import WorldTileContainer from '$lib/modules/worldTileContainer.svelte';

    export let data;
    let game = new Game(data.game);

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
        clickedBuildEn = event.detail.en;
    }

    function clickedProduce(event) {
        clickedProduceEn = event.detail.en;
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

<div id="gameContainer">

    <BtnContainer on:build={clickedBuild} on:produce={clickedProduce}/>

    <div id="tileContainer">
        <div>
            <WorldTileContainer {game} />
            <MoveTileContainer {clickedUnit}/>
            <BulidTileContainer {clickedBuildEn}/>
            <ProduceTileContainer {clickedProduceEn}/>
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
