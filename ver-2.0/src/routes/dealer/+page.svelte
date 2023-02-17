<script>
    export let data;
    const roomList = data.roomList;
</script>

<h1>Dealer Page</h1>

<a href="/dealer/room">Create a room</a>

{#each roomList as room}
    <a href="/dealer/game/{room.title}">{room.title}</a>
{/each}