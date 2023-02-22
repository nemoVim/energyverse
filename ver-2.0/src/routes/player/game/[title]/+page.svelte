<script>
    import { browser } from '$app/environment';
    import { getReq } from '$lib/utils/requests';
    import { Game } from '$lib/classes/game';
    import energy_pic from '$lib/assets/energy_img.png';
    import unit_pic from '$lib/assets/unit_img.png';
    import temp_pic from '$lib/assets/temp_img.png';
    import ai_pic from '$lib/assets/Energy_Ai.png';
    import grid_pic from '$lib/assets/Grid_modernization.png';
    import mat_pic from '$lib/assets/Energy_Materials_and_Devices.png';
    import env_pic from '$lib/assets/Environment_and_Climate.png';
    import hyd_pic from '$lib/assets/Hydrogen_Energy.png';
    import arrow_pic from '$lib/assets/arrow.png';
    import tech_0 from '$lib/assets/tech_0.png';
    import tech_1 from '$lib/assets/tech_1.png';
    import tech_2 from '$lib/assets/tech_2.png';
    import tech_3 from '$lib/assets/tech_3.png';
    import tech_4 from '$lib/assets/tech_4.png';
    import tech_5 from '$lib/assets/tech_5.png';
    import tech_6 from '$lib/assets/tech_6.png';
    import tech_7 from '$lib/assets/tech_7.png';
    import tech_8 from '$lib/assets/tech_8.png';
    import tech_9 from '$lib/assets/tech_9.png';
    import tech_10 from '$lib/assets/tech_10.png';
    import tech_11 from '$lib/assets/tech_11.png';
    import tech_12 from '$lib/assets/tech_12.png';
    import tech_13 from '$lib/assets/tech_13.png';
    import tech_14 from '$lib/assets/tech_14.png';
    import tech_15 from '$lib/assets/tech_15.png';
    import tech_16 from '$lib/assets/tech_16.png';
    import tech_17 from '$lib/assets/tech_17.png';

    const techImgList = [
        tech_0,
        tech_1,
        tech_2,
        tech_3,
        tech_4,
        tech_5,
        tech_6,
        tech_7,
        tech_8,
        tech_9,
        tech_10,
        tech_11,
        tech_12,
        tech_13,
        tech_14,
        tech_15,
        tech_16,
        tech_17,
    ];

    let showingImgIdx = -1;

    const pageTitleList = [
        '공통 기술',
        '풍력 기술',
        '태양광 기술',
        '원자력 기술',
    ];

    $: {
        console.log(viewIndex);
    }
    import {
        techNameList,
        checkTech,
        techContentList,
    } from '$lib/classes/tech';

    export let data;

    let game = new Game(data.game);

    let limitTimeList = [120, 120, 120, 120, 120, 120];

    game.playerList.forEach((player, i) => {
        limitTimeList[i] = Math.floor(player.limit);
    });

    setInterval(() => {
        if (game.stop === 0) {
            const player = game.playerList[game.turn];
            limitTimeList[player.index] = Math.floor(player.limit);
        }
    }, 100);

    async function longPolling() {
        try {
            const resMsg = await getReq(
                fetch,
                `/api/game/change?title=${game.title}`
            );
            console.log(resMsg);
            game = new Game(resMsg);
            console.log('end');
            await longPolling();
        } catch (e) {
            console.log('error');
            console.log(e);
            setTimeout(async () => {
                await longPolling();
            }, 1000);
        }
    }

    if (browser) {
        console.log('startPolling');
        longPolling();
    }

    const playerIdxList = [0, 1, 2, 3, 4, 5];

    let viewIndex = data.player;

    function setPlayer(i) {
        viewIndex = i;
    }

    let isChecked = false;

    $: nowPlayer = game.playerList[viewIndex];

    let pageNum = 0;
    const maxPage = 3;

    function nextPage() {
        pageNum += 1;
        if (pageNum === 4) {
            pageNum = 0;
        }
    }

    function previousPage() {
        pageNum -= 1;
        if (pageNum === -1) {
            pageNum = maxPage;
        }
    }

    function showImg(index) {
        console.log(index);
        showingImgIdx = index;
    }
</script>

<div id="firstLine">
    <div id="titleBox" class="whiteBox">
        <div id="titleContent">
            <p>{game.title}{Number(viewIndex) + 1}</p>
        </div>
    </div>

    <div id="headBox" class="whiteBox">
        <div id="energyContent" class="box">
            <img id="energypicture" src={energy_pic} alt="The icon of energy" />
            <p>{nowPlayer.energy}/{nowPlayer.energyStorage}</p>
            <p>&nbsp(+{nowPlayer.earn})</p>
        </div>
        <div id="unitContent" class="box">
            <img id="unitpicture" src={unit_pic} alt="icon of unit" />
            <p>{nowPlayer.unitList.length}/{nowPlayer.unitStorage}</p>
        </div>
        <div id="tempContent" class="box">
            <img id="temppicture" src={temp_pic} alt="icon of temp" />
            <p>{Number(game.temp.toFixed(1)) + 15}°C</p>
        </div>
        <div id="c_round" class="box">
            <p id="c_round_count">Round {game.round}</p>
        </div>
        <div id="c_time" class="box">
            <p>{limitTimeList[viewIndex]}초</p>
        </div>
    </div>
</div>

<div id="secondLine">
    <div id="labBox" class="whiteBox">
        <div id="matContentBox" class="labContentBox">
            <img id="matpicture" src={mat_pic} alt="icon of mat" />
            <p>Lv.{nowPlayer.tech.material}</p>
        </div>
        <div id="hydContentBox" class="labContentBox">
            <img id="hydpicture" src={hyd_pic} alt="icon of hyd" />
            <p>Lv.{nowPlayer.tech.hydrogen}</p>
        </div>
        <div id="envContentBox" class="labContentBox">
            <img id="envpicture" src={env_pic} alt="icon of env" />
            <p>Lv.{nowPlayer.tech.environment}</p>
        </div>
        <div id="gridContentBox" class="labContentBox">
            <img id="gridpicture" src={grid_pic} alt="icon of grid" />
            <p>Lv.{nowPlayer.tech.grid}</p>
        </div>
        <div id="aiContentBox" class="labContentBox">
            <img id="aipicture" src={ai_pic} alt="icon of ai" />
            <p>Lv.{nowPlayer.tech.ai}</p>
        </div>
    </div>

    <div id="techBox" class="whiteBox">
        <p class="subTitle">{pageTitleList[pageNum]}</p>
        <div id="techBoxBox">
            <div class="arrowDiv">
                <button
                    type="button"
                    id="leftArrowButton"
                    on:click={previousPage}
                >
                    <img id="leftArrow" src={arrow_pic} alt="icon of arrow" />
                </button>
            </div>
            {#if pageNum === 0}
                <div id="generalTech" class="techDiv">
                    {#each techContentList as techName, i}
                        {#if i <= 5}
                            <button
                                class="techContainor-{checkTech(
                                    nowPlayer.tech,
                                    i
                                )}"
                                on:click={() => {
                                    showImg(i);
                                }}
                            >
                                {#if isChecked}
                                    <p>{techName}</p>
                                {:else}
                                    <p>{techNameList[i]}</p>
                                {/if}
                            </button>
                        {/if}
                    {/each}
                </div>
            {:else if pageNum === 1}
                <div id="hydTech" class="techDiv">
                    {#each techContentList as techName, i}
                        {#if i > 5 && i <= 9}
                            <button
                                class="techContainor-{checkTech(
                                    nowPlayer.tech,
                                    i
                                )}"
                                on:click={() => {
                                    showImg(i);
                                }}
                            >
                                {#if isChecked}
                                    <p>{techName}</p>
                                {:else}
                                    <p>{techNameList[i]}</p>
                                {/if}
                            </button>
                        {/if}
                    {/each}
                </div>
            {:else if pageNum === 2}
                <div id="matTech" class="techDiv">
                    {#each techContentList as techName, i}
                        {#if i > 9 && i <= 13}
                            <button
                                class="techContainor-{checkTech(
                                    nowPlayer.tech,
                                    i
                                )}"
                                on:click={() => {
                                    showImg(i);
                                }}
                            >
                                {#if isChecked}
                                    <p>{techName}</p>
                                {:else}
                                    <p>{techNameList[i]}</p>
                                {/if}
                            </button>
                        {/if}
                    {/each}
                </div>
            {:else if pageNum === 3}
                <div id="envTech" class="techDiv">
                    {#each techContentList as techName, i}
                        {#if i > 13 && i <= 17}
                            <button
                                class="techContainor-{checkTech(
                                    nowPlayer.tech,
                                    i
                                )}"
                                on:click={() => {
                                    showImg(i);
                                }}
                            >
                                {#if isChecked}
                                    <p>{techName}</p>
                                {:else}
                                    <p>{techNameList[i]}</p>
                                {/if}
                            </button>
                        {/if}
                    {/each}
                </div>
            {/if}
            <div class="arrowDiv">
                <button type="button" id="rightArrowButton" on:click={nextPage}>
                    <img id="rightArrow" src={arrow_pic} alt="icon of arrow" />
                </button>
            </div>
        </div>
        <div id="checkboxDiv">
            <input
                id="cB"
                type="checkbox"
                name="chk_info"
                bind:checked={isChecked}
            />
            <p>기술 이름을 기술 능력으로 변경</p>
        </div>
    </div>

    <div id="roundTableBox" class="whiteBox">
        {#each playerIdxList as player, i}
            <button
                id="player{i}"
                class="mark"
                class:turn={game.turn === i}
                on:click={() => {
                    setPlayer(i);
                }}
            />
        {/each}
    </div>
</div>

{#each techImgList as techImg, i}
    <div
        class="techPicture"
        class:hidden={i !== showingImgIdx}
        on:click={() => {
            showImg(-1);
        }}
        on:keypress={() => {}}
    >
        <img src={techImg} alt="tech" />
    </div>
{/each}

<style>
    .hidden {
        display: none !important;
    }

    .whiteBox {
        display: flex;
        justify-content: space-around;
        border-radius: 0.5rem;
        margin: 2rem;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        background-color: white;
        padding: 1rem;
        border: solid black 0.3rem;
        font-size: 2.5rem;
    }

    #titleBox {
        width: 10rem;
    }

    #titleContent {
        padding-right: 2rem;
        padding-left: 2rem;
        display: flex;
        color: #000000;
        font-size: 2.5rem;
    }

    #titleContent p {
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
    }

    #headBox > div {
        display: flex;
        border-right: black 0.1rem solid;
        padding-right: 2rem;
        margin-right: 2rem;
    }

    #headBox > div:first-child {
        margin-left: 1rem;
    }

    #headBox > div:last-child {
        padding: 0;
        margin-right: 1rem;
        border: none;
    }

    #headBox > div > img {
        margin-right: 1rem;
        height: 4rem;
    }

    .box p {
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
    }

    #temppicture {
        height: 4rem;
        margin-right: 1rem;
    }

    #labBox {
        flex-direction: column;
        padding: 2rem;
    }

    #labBox > div {
        position: relative;
    }

    #labBox > div:nth-child(2n) {
        padding-left: 5rem;
    }

    #labBox img {
        width: 6rem;
        height: 6rem;
        object-fit: cover;
        border-radius: 70%;
    }

    .labContentBox {
        display: flex;
        align-items: center;
    }

    .labContentBox > img {
        border: solid black 0.2rem;
    }

    .labContentBox > p {
        margin: 0;
        padding-left: 1rem;
        font-size: 2.5rem;
    }

    #roundTableBox {
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 1rem 1.5rem;
    }

    .mark {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        border: black solid 0.2rem;
    }

    .turn {
        width: 5rem;
        height: 5rem;
    }

    #player0 {
        background-color: rgb(255, 120, 120);
    }

    #player1 {
        background-color: rgb(255, 255, 119);
    }

    #player2 {
        background-color: rgb(123, 255, 123);
    }

    #player3 {
        background-color: rgb(85, 119, 255);
    }

    #player4 {
        background-color: rgb(213, 92, 213);
    }

    #player5 {
        background-color: white;
    }

    #techBox {
        flex-direction: column;
    }

    .tech {
        font-size: 1.8rem;
    }

    .techContainor {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1rem;
        border: black solid;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        width: 22rem;
        height: 5rem;
        margin-left: 3.5rem;
        margin-right: 3.5rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        background-color: rgb(202, 246, 185);
        font-size: 1.5rem;
    }

    .subTitle {
        text-align: center;
        margin-top: 1rem;
        padding: 1rem;
        font-size: 3rem;
    }

    .tC {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding-top: 1rem;
    }

    #cB {
        width: 1.2rem;
        height: 1.2rem;
    }

    #checkboxDiv {
        display: flex;
        margin-left: 1rem;
        align-items: center;
        margin-top: 1rem;
    }

    #checkboxDiv > p {
        font-size: 1.5rem;
    }

    .arrowDiv {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .arrowDiv > button {
        background: transparent;
        border: 0;
        outline: 0;
    }

    .arrowDiv > button > img {
        width: 4rem;
    }

    #leftArrow {
        transform: rotate(180deg);
    }

    #techBox p {
        margin: 0;
    }

    #techBoxBox {
        display: flex;
    }

    #firstLine {
        display: flex;
        margin: 2rem;
        margin-bottom: 0rem;
        justify-content: space-between;
    }

    #secondLine {
        display: flex;
        margin: 2rem;
        margin-top: 0rem;
        justify-content: space-around;
    }

    #wholeDisplay {
        position: fixed;
        width: 100%;
        height: 100%;
    }

    .techContainor:active {
        box-shadow: 0 0 0 1px #ffffff inset,
            0 0 0 2px rgba(255, 255, 255, 0.15) inset,
            0 0 0 1px rgba(0, 0, 0, 0.4);
    }

    .notTechContainor {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1rem;
        border: black solid;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        width: 22rem;
        height: 5rem;
        margin-left: 3.5rem;
        margin-right: 3.5rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .notTechContainor:active {
        box-shadow: 0 0 0 1px #ffffff inset,
            0 0 0 2px rgba(255, 255, 255, 0.15) inset,
            0 0 0 1px rgba(0, 0, 0, 0.4);
    }

    .techPicture img {
        height: 40rem;
        z-index: 2;
    }

    .techPicture {
        position: fixed;
        top: 0rem;
        right: 0rem;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        padding: 13rem 22rem;
        display: flex;
        justify-content: right;
    }

    .techDiv {
        display: flex;
        flex-wrap: wrap;
    }

    .techDiv > button {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1rem;
        border: black solid 0.2rem;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        background-color: white;
        font-size: 2rem;
        padding: 1.2rem 1.5rem;
        flex: 1 0 45%;
        margin: 1rem;
        white-space: nowrap;
    }

    .techContainor-true {
        background-color: rgb(202, 246, 185) !important;
    }
</style>
