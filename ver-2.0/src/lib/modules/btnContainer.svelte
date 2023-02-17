<script>
    let showBuildDiv = false;

    function toggleBuildDiv() {
        showBuildDiv = !showBuildDiv;
    }

    let clickedBuildBtn = '';

    let showProduceDiv = false;

    function toggleProduceDiv() {
        showProduceDiv = !showProduceDiv;
    }
    
    let clickedProduceBtn = '';


</script>
<button on:click={toggleBuildDiv}>건설</button>
<button on:click={toggleProduceDiv}>생산</button>

{#if showBuildDiv}
    <div class="layer" on:keypress={() => {}} on:click={toggleBuildDiv}>
        <button
            on:click={() => {
                makeValidBuildPosList('factory');
            }}>build Factory</button
        >
    </div>
{/if}

{#if showProduceDiv}
    <div class="layer" on:keypress={() => {}} on:click={toggleProduceDiv}>
        <button
            on:click={() => {
                makeValidProducePosList('probe');
            }}>produce Probe</button
        >
    </div>
{/if}