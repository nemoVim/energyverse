<script>
    export let data;

    let roomList = data.roomList;

    async function joinRoom(title) {
        location.href = `/room/${title}`;
    }
</script>

<div id="roomContainer">
    {#each roomList as room}
        <button class="roomBtn" on:click={() => joinRoom(room.title)}>
            <p>Title: {room.title}</p>
            <p>Dealer: {room.dealer}</p>
        </button>
    {/each}
</div>

<style>
    #roomContainer {
        display: flex;
    }

    .roomBtn {
        border: 0.1rem black solid;
        margin: 1rem;
        padding: 1rem;
    }
</style>
