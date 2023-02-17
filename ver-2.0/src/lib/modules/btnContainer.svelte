<script>
    import { createEventDispatcher } from 'svelte';

    let showBuildDiv = false;

    function toggleBuildDiv() {
        showBuildDiv = !showBuildDiv;
    }

    let showProduceDiv = false;

    function toggleProduceDiv() {
        showProduceDiv = !showProduceDiv;
    }

    const dispatch = createEventDispatcher();

    function clickProduceBtn(produceEn) {
        dispatch('produce', {
            produceEn: produceEn,
        });
    }


    function clickBuildBtn(buildEn) {
        dispatch('build', {
            buildEn: buildEn,
        });
    }


</script>

<div id="btnContainer">
    <button on:click={toggleBuildDiv}>건설</button>
    <button on:click={toggleProduceDiv}>생산</button>
</div>

{#if showBuildDiv}
    <div class="layer" on:keypress={() => {}} on:click={toggleBuildDiv}>
        <button
            on:click={() => {clickBuildBtn('factory')}}>Factory</button
        >
        <button
            on:click={() => {clickBuildBtn('solarPower')}}>Solar Power</button
        >
    </div>
{/if}

{#if showProduceDiv}
    <div class="layer" on:keypress={() => {}} on:click={toggleProduceDiv}>
        <button
            on:click={() => {clickProduceBtn('probe')}}>produce Probe</button
        >
    </div>
{/if}

<style>

    button {
        font-size: 2rem;
        padding: 1rem;
        margin: 1rem;
    }
    
    #btnContainer {
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        z-index: 1;
    }

    .layer {
        background-color: rgba(0, 0, 0, 0.2);
        position: fixed;
        width: -webkit-fill-available;
        height: -webkit-fill-available;
        top: 0;
        left: 0;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>