<script>
    export let data;

    let roomList = data.roomList;
</script>

<div id="pLT">
    <h1 id="playerLobbyTitle">플레이어 로비</h1>
</div>

<!-- <hr id="seperator" /> -->

<div id="roomContainer">
    {#each roomList as room}
        <a class="roomAnchor" href="/player/room/{room.title}">
            <div id="roomContainerContents">
                <p><b>ROOM {room.title}</b></p>
                <hr />
                <p>{room.dealer} 딜러</p>
            </div>
        </a>
    {/each}
</div>

<style>
    #pLT {
        display: flex;
        justify-content: center;
    }

    #roomContainer {
        display: flex;
        margin-top: 2rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .roomAnchor {
        justify-content: center;
        width: 25rem;
        margin: 1rem;
        padding: 2rem;
        font-size: 1.5rem;
        border-radius: 0.5rem;
        border: solid black 0.25rem;
        background-color: #ffffff;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        color: black;
        text-decoration: none;
    }

    .roomAnchor:hover {
        background-color: #ecfaff;
    }

    .roomAnchor:active {
        box-shadow: 0 0 0 1px #ffffff inset,
            0 0 0 2px rgba(255, 255, 255, 0.15) inset,
            0 0 0 1px rgba(0, 0, 0, 0.4);
    }

    .roomAnchor p {
        margin: 0;
    }

    .roomAnchor hr {
        margin: 1rem 0;
    }

    #playerLobbyTitle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;
        height: 6rem;
        border: thick double #32a1ce;
        border-radius: 1rem;
        background-color: white;
        font-size: 2.5rem;
    }

    #roomContainerContents {
        justify-content: center;
    }

    #seperator {
        border: 0;
        height: 2px;
        background: #000;
    }
</style>
