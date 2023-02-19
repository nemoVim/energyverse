<script>
    export let data;
    const room = data.room;

    function joinGame(player) {
        location.href = `/player/game/${room.title}?player=${player}`;
    }
</script>

<div id="pRT">
    <h1 id="playerRoomTitle">{room.title} Room / 딜러: {room.dealer}</h1>
</div>  

<hr id="seperator" />

<div id="pSB">
    {#each room.playerList as player}
    <button id="playerSelectButton" 
        on:click={() => 
        {
            joinGame(player);
        }}>
            {player}
    </button>
    {/each}
</div>

<style>
    #playerRoomTitle{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;
        height: 6rem;
        border: thick double #32a1ce;
        border-radius:1rem;
        background-color: white;
        font-size: 2.5rem;
    }

    #seperator{
        border:0;
        height:2px;
        background: #000;
    }

    #pRT{
        display: flex;
        justify-content: center;
    }

    #playerSelectButton{
        width: 30rem;
        margin: 1rem;
        padding: 3rem;
        height: 15rem;
        font-size: 1.5rem;
        border-radius: 1rem;
        border:solid black;
        background-color: #ffffff;
        box-shadow: 0.3rem 0.3rem 0.3rem     rgb(173, 173, 173);
        color: black;
        text-decoration: none;
    }
    
    #pSB{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
</style>
