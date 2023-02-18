<script>
    export let data;

    let roomList = data.roomList;
</script>

<div id="roomContainer">
    {#each roomList as room}
        <a class="roomAnchor" href="/player/room/{room.title}">
            <p>Title: {room.title}</p>
            <p>Dealer: {room.dealer}</p>
        </a>
    {/each}
</div>

<style>
    #roomContainer {
        display: flex;
    }

    .roomAnchor {
        border: 0.1rem black solid;
        margin: 1rem;
        padding: 1rem;
    }
</style>
