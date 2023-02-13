<script>
    export let data;
    const room = data.room;

    function joinGame(player) {
        location.href = `/game/${room.title}?player=${player}`;
    }
</script>

<h1>{room.title}</h1>
<p>{room.dealer}</p>

<hr />

{#each room.playerList as player}
    <button
        on:click={() => {
            joinGame(player);
        }}>{player}</button
    >
{/each}

<style></style>
