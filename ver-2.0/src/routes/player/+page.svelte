<script>
    export let data;

    let roomList = data.roomList;
</script>

<div id="pLT">
    <h1 id="playerLobbyTitle">플레이어 로비</h1>
</div>

<hr id="seperator" />

<div>
    <div id="realRoomContainer">
        <div id="roomContainer">
            {#each roomList as room}
            <a class="roomAnchor" href="/player/room/{room.title}">
                <div id="roomContainerContents">
                    <p>방 이름: {room.title}</p>
                    <p>딜러: {room.dealer}</p>
                </div>
            </a>
            {/each}
        </div>
    </div>
</div>


<style>
    #pLT{
        display: flex;
        justify-content: center;
    }

    

    #roomContainer {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .roomAnchor {
        justify-content: center;
        width: 25rem;
        margin: 1rem;
        padding: 3rem;
        font-size: 1.5rem;
        border-radius: 1rem;
        border:solid black;
        background-color: #ffffff;
        box-shadow: 0.3rem 0.3rem 0.3rem     rgb(173, 173, 173);
        color: black;
        text-decoration: none;
    }
    
    .roomAnchor:hover {
        background-color: #ecfaff;
    }

    .roomAnchor:active {
        box-shadow: 0 0 0 1px #ffffff inset,
        0 0 0 2px rgba(255,255,255,0.15) inset,
        0 0 0 1px rgba(0,0,0,0.4);
    }

    #playerLobbyTitle {
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

    #roomContainerContents{
        justify-content: center;
        padding-left: 8rem;
    }

    #seperator{
        border:0;
        height:2px;
        background: #000;
    }
</style>
