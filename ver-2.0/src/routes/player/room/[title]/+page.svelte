<script>
    export let data;
    const room = data.room;

    function joinGame(idx) {
        location.href = `/player/game/${room.title}?player=${idx}`;
    }
</script>

<div id="pRT">
    <h1 id="playerRoomTitle">ROOM {room.title} / {room.dealer} 딜러</h1>
</div>  

<div id="pSB">
    {#each room.playerList as player, i}
    <button id="playerSelectButton" 
        on:click={() => 
        {
            joinGame(i);
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
        padding: 2rem 7rem;
        background-color: white;
        border: .7rem solid #37aad7;
        border-radius: 7rem;
        font-size: 3.5rem;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        margin: 2rem;
        margin-top: 5rem;
    }

    #pRT{
        display: flex;
        justify-content: center;
    }

    #playerSelectButton{
        justify-content: center;
        width: 30rem;
        margin: 1rem;
        padding: 4rem;
        font-size: 3rem;
        border-radius: 0.5rem;
        border: solid black 0.4rem;
        background-color: #ffffff;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        color: black;
        text-decoration: none;
    }

    #playerSelectButton:hover {
        background-color: #e8f8ff;
        cursor: pointer;
    }
    
    #playerSelectButton:active {
        box-shadow: 0 0 0 1px #ffffff inset,
            0 0 0 2px rgba(255, 255, 255, 0.15) inset,
            0 0 0 1px rgba(0, 0, 0, 0.4);
    }

    #pSB{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 2rem;
    }
</style>
