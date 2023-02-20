<script>
    import { Buildings, Lab } from '$lib/classes/buildings';
    import { checkTech } from '$lib/classes/tech';
    import { Units } from '$lib/classes/units';
    import { createEventDispatcher } from 'svelte';

    export let game;

    $: nowPlayer = game.playerList[game.turn];

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

    function clickBuildBtn(buildEn, labTrack = null) {
        dispatch('build', {
            buildEn: buildEn,
            labTrack: labTrack,
        });
    }
</script>

<div id="btnContainer">
    <button on:click={toggleBuildDiv}>건설</button>
    <button on:click={toggleProduceDiv}>생산</button>
</div>

{#if showBuildDiv}
    <div class="layer" on:keypress={() => {}} on:click={toggleBuildDiv}>
        <div>
            {#if Buildings['factory'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickBuildBtn('factory');
                    }}>Factory</button
                >
            {/if}
            {#if Buildings['thermalPower'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickBuildBtn('thermalPower');
                    }}>thermal Power</button
                >
            {/if}
            {#if checkTech(nowPlayer.tech, 6) && Buildings['windPower'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickBuildBtn('windPower');
                    }}>wind Power</button
                >
            {/if}
            {#if checkTech(nowPlayer.tech, 10) && Buildings['solarPower'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickBuildBtn('solarPower');
                    }}>solar Power</button
                >
            {/if}
            {#if checkTech(nowPlayer.tech, 14) && Buildings['atomicPower'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickBuildBtn('atomicPower');
                    }}>atomic Power</button
                >
            {/if}
        </div>

        <div>
            {#if Buildings['lab'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickBuildBtn('lab', 'material');
                    }}>material Lab</button
                >
                <button
                    on:click={() => {
                        clickBuildBtn('lab', 'hydrogen');
                    }}>hydrogen Lab</button
                >
                <button
                    on:click={() => {
                        clickBuildBtn('lab', 'grid');
                    }}>grid Lab</button
                >
                <button
                    on:click={() => {
                        clickBuildBtn('lab', 'environment');
                    }}>environment Lab</button
                >
                <button
                    on:click={() => {
                        clickBuildBtn('lab', 'ai');
                    }}>ai Lab</button
                >
            {/if}
        </div>
    </div>
{/if}

{#if showProduceDiv}
    <div class="layer" on:keypress={() => {}} on:click={toggleProduceDiv}>
        {#if nowPlayer.unitList.length < nowPlayer.unitStorage && nowPlayer.buildings['공장'] >= 1}
            {#if Units['probe'].cost <= nowPlayer.energy && nowPlayer.units['일꾼'] < 3}
                <button
                    on:click={() => {
                        clickProduceBtn('probe');
                    }}>Probe</button
                >
            <!-- {:else if checkTech(nowPlayer.tech, 9) && Units['probe'].cost <= nowPlayer.energy && nowPlayer.units['일꾼'] < 4}
                <button
                    on:click={() => {
                        clickProduceBtn('probe');
                    }}>Probe</button
                > -->
            {/if}
            {#if checkTech(nowPlayer.tech, 7) && Units['windUnit'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickProduceBtn('windUnit');
                    }}>wind Unit</button
                >
            {/if}
            {#if checkTech(nowPlayer.tech, 11) && Units['solarUnit'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickProduceBtn('solarUnit');
                    }}>solar Unit</button
                >
            {/if}
            {#if checkTech(nowPlayer.tech, 15) && Units['atomicUnit'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickProduceBtn('atomicUnit');
                    }}>atomic Unit</button
                >
            {/if}
            {#if checkTech(nowPlayer.tech, 17) && Units['missile'].cost <= nowPlayer.energy}
                <button
                    on:click={() => {
                        clickProduceBtn('missile');
                    }}>missile</button
                >
            {/if}
        {/if}
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

    .layer > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
