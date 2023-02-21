<script>
    import { Game } from "$lib/classes/game";
    import energy_pic from "$lib/assets/energy_img.png";
    import unit_pic from "$lib/assets/unit_img.png";
    import temp_pic from "$lib/assets/temp_img.png";
    import ai_pic from "$lib/assets/Energy_Ai.png";
    import grid_pic from "$lib/assets/Grid_modernization.png";
    import mat_pic from "$lib/assets/Energy_Materials_and_Devices.png";
    import env_pic from "$lib/assets/Environment_and_Climate.png";
    import hyd_pic from "$lib/assets/Hydrogen_Energy.png";
    import arrow_pic from "$lib/assets/arrow.png";

    import {
        techNameList,
        checkTech,
        techContentList,
    } from "$lib/classes/tech";

    export let data;

    let game = new Game(data.game);

    import { browser } from '$app/environment';
    import { getReq } from '$lib/utils/requests';

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
            setTimeout(async () => {await longPolling()}, 1000);
        }
    }

    if (browser) {
        console.log('startPolling');
        longPolling();
    }

    const viewIndex = data.player;

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
</script>

<div id="titleBox">
    <div id="titleContent">
        <p>Game: {game.title}</p>
    </div>
</div>

<div id="headBox">
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
        <p>{game.temp}°C</p>
    </div>
    <div id="c_round" class="box">
        <p id="c_round_round">Round</p>
        <p id="c_round_count">{game.round}</p>
    </div>
    <div id="c_time" class="box">
        <p>{limitTimeList[nowPlayer.index]}초</p>
    </div>
</div>

<div id="labBox">
    <div id="matContentBox" class="labContentBox">
        <div id="matContent" class="labContent">
            <img id="matpicture" src={mat_pic} alt="icon of mat" />
            <p>Lv.{nowPlayer.tech.material}</p>
        </div>
    </div>
    <div id="hydContentBox" class="labContentBox">
        <div id="hydContent" class="labContent">
            <img id="hydpicture" src={hyd_pic} alt="icon of hyd" />
            <p>Lv.{nowPlayer.tech.hydrogen}</p>
        </div>
    </div>
    <div id="envContentBox" class="labContentBox">
        <div id="envContent" class="labContent">
            <img id="envpicture" src={env_pic} alt="icon of env" />
            <p>Lv.{nowPlayer.tech.environment}</p>
        </div>
    </div>
    <div id="gridContentBox" class="labContentBox">
        <div id="gridContent" class="labContent">
            <img id="gridpicture" src={grid_pic} alt="icon of grid" />
            <p>Lv.{nowPlayer.tech.grid}</p>
        </div>
    </div>
    <div id="aiContentBox" class="labContentBox">
        <div id="aiContent" class="labContent">
            <img id="aipicture" src={ai_pic} alt="icon of ai" />
            <p>Lv.{nowPlayer.tech.ai}</p>
        </div>
    </div>
</div>

<div id="roundTableBox">
    <a class="playermark" href="/player/game/{game.title}?player=0">
        <div id="player1" class="mark" />
    </a>
    <a class="playermark" href="/player/game/{game.title}?player=1">
        <div id="player2" class="mark" />
    </a>
    <a class="playermark" href="/player/game/{game.title}?player=2">
        <div id="player3" class="mark" />
    </a>
    <a class="playermark" href="/player/game/{game.title}?player=3">
        <div id="player4" class="mark" />
    </a>
    <a class="playermark" href="/player/game/{game.title}?player=4">
        <div id="player5" class="mark" />
    </a>
    <a class="playermark" href="/player/game/{game.title}?player=5">
        <div id="player6" class="mark" />
    </a>
</div>

<div id="techbox">
    {#if pageNum === 0}
        <div id="generalTech" class="tech">
            <p class="subTitle">공통 영역</p>
            <div class="tC">
                {#if isChecked}
                    {#each techContentList as techName, i}
                        {#if i <= 5}
                            <div
                                id="generalTechContainor"
                                class="techContainor"
                            >
                                <p>{techName}</p>
                            </div>
                        {/if}
                    {/each}
                {/if}

                {#if !isChecked}
                    {#each techNameList as techContent, i}
                        {#if i <= 5}
                            <div
                                id="generalTechContainor"
                                class="techContainor"
                            >
                                <p>{techContent}</p>
                            </div>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
    {:else if pageNum === 1}
        <div id="hydTech" class="tech">
            <p class="subTitle">풍력 영역</p>
            <div class="tC">
                {#if isChecked}
                    {#each techContentList as techName, i}
                        {#if i > 5 && i <= 9}
                            <div
                                id="hydTechContainor"
                                class="techContainor"
                            >
                                <p>{techName}</p>
                            </div>
                        {/if}
                    {/each}
                {/if}

                {#if !isChecked}
                    {#each techNameList as techContent, i}
                        {#if i > 5 && i <= 9}
                            <div
                                id="hydTechContainor"
                                class="techContainor"
                            >
                                <p>{techContent}</p>
                            </div>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
    {:else if pageNum === 2}
        <div id="matTech" class="tech">
            <p class="subTitle">태양광 영역</p>
            <div class="tC">
                {#if isChecked}
                    {#each techContentList as techName, i}
                        {#if i > 9 && i <= 13}
                            <div
                                id="matTechContainor"
                                class="techContainor"
                            >
                                <p>{techName}</p>
                            </div>
                        {/if}
                    {/each}
                {/if}

                {#if !isChecked}
                    {#each techNameList as techContent, i}
                        {#if i > 9 && i <= 13}
                            <div
                                id="matTechContainor"
                                class="techContainor"
                            >
                                <p>{techContent}</p>
                            </div>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
    {:else if pageNum === 3}
        <div id="envTech" class="tech">
            <p class="subTitle">원자력 영역</p>
            <div class="tC">
                {#if isChecked}
                    {#each techContentList as techName, i}
                        {#if i > 13 && i <= 17}
                            <div
                                id="envTechContainor"
                                class="techContainor"
                            >
                                <p>{techName}</p>
                            </div>
                        {/if}
                    {/each}
                {/if}

                {#if !isChecked}
                    {#each techNameList as techContent, i}
                        {#if i > 13 && i <= 17}
                            <div
                                id="envTechContainor"
                                class="techContainor"
                            >
                                <p>{techContent}</p>
                            </div>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
    <div id="checkBox">
        <div id="checkBoxBox">
            <input
                id="cB"
                type="checkbox"
                name="chk_info"
                bind:checked={isChecked}
            />
            <p>기술 이름을 기술 능력으로 변경</p>
        </div>
    </div>
    <div id="arrows">
        <button type="button" id="rightArrowButton" on:click={nextPage}>
            <img id="rightArrow" src={arrow_pic} alt="icon of arrow" />
        </button>
        <button type="button" id="leftArrowButton" on:click={previousPage}>
            <img id="leftArrow" src={arrow_pic} alt="icon of arrow" />
        </button>
    </div>
</div>

<div />

<style>
    #titleBox {
        display: inline-flex;
        border-radius: 1rem;
        position: fixed;
        margin-right: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        top: 0.5rem;
        left: 2rem;
        background-color: rgb(239, 239, 239);
    }

    #titleContent {
        padding-right: 2rem;
        padding-left: 2rem;
        display: inline-flex;
        width: auto;
        color: #000000;
        font-size: 2.8rem;
    }

    #titleContent p {
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
    }

    .playerDiv {
        border: black 0.1rem solid;
    }

    #headBox {
        display: inline-flex;
        border-radius: 1rem;
        position: fixed;
        margin-left: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        top: 0.5rem;
        right: 2rem;
        background-color: rgb(239, 239, 239);
    }

    #energyContent {
        padding-right: 2rem;
        margin-left: 2rem;
        display: inline-flex;
        width: auto;
        color: #000000;
        border-right: solid rgb(210, 210, 210);
        font-size: 2.8rem;
    }
    #energypicture {
        height: 4rem;
        margin-right: 1rem;
    }
    #energyContent p {
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
    }
    #unitpicture {
        height: 4rem;
        margin-right: 1rem;
    }
    #unitContent {
        padding-right: 2rem;
        margin-left: 2rem;
        display: inline-flex;
        width: auto;
        color: #000000;
        border-right: solid rgb(210, 210, 210);
        font-size: 2.8rem;
    }

    .box p {
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
    }

    #temppicture {
        height: 4rem;
        margin-right: 1rem;
    }
    #tempContent {
        padding-right: 2rem;
        padding-left: 2rem;
        display: inline-flex;
        width: auto;
        color: #000000;
        border-right: solid rgb(210, 210, 210);
        font-size: 2.8rem;
    }

    #tempContent p {
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
    }

    #c_round {
        display: inline-flex;
        width: auto;
        color: #000000;
        border-right: solid rgb(210, 210, 210);
        font-size: 2.8rem;
        padding-right: 2rem;
        padding-left: 2rem;
    }
    #c_round_round {
        font-size: 0.8rem;
    }
    #c_round_count {
        font-size: 2.8rem;
    }
    #c_time {
        padding-left: 2rem;
        display: inline-flex;
        width: 10rem;
        color: #000000;
        font-size: 2.8rem;
    }

    #labBox {
        border-radius: 1rem;
        position: fixed;
        height: 31.5rem;
        width: 17.5rem;
        margin-right: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        top: 10rem;
        left: 2rem;
        background-color: rgb(239, 239, 239);
    }

    #labBox img {
        width: 6rem;
        height: 6rem;
        object-fit: cover;
        border-radius: 70%;
    }

    .labContentBox {
        background-color: white;
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        border: black solid;
        font-size: 1.8rem;
    }

    #matContentBox {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
    }

    #hydContentBox {
        position: absolute;
        top: 6.5rem;
        left: 5.5rem;
    }

    #envContentBox {
        position: absolute;
        top: 12.5rem;
        left: 0.5rem;
    }

    #gridContentBox {
        position: absolute;
        top: 18.5rem;
        left: 5.5rem;
    }

    #aiContentBox {
        position: absolute;
        top: 24.5rem;
        left: 0.5rem;
    }

    .labContent p {
        position: relative;
        bottom: 7rem;
        left: 7rem;
        font-size: 2rem;
    }

    #roundTableBox {
        border-radius: 1rem;
        position: fixed;
        height: 31.5rem;
        width: 8rem;
        margin-left: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        top: 10rem;
        right: 2rem;
        background-color: rgb(239, 239, 239);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .mark {
        margin-top: 0.35rem;
        margin-bottom: 0.35rem;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        border: black solid;
    }

    #player1 {
        background-color: rgb(255, 120, 120);
    }

    #player2 {
        background-color: rgb(255, 255, 119);
    }

    #player3 {
        background-color: rgb(123, 255, 123);
    }

    #player4 {
        background-color: rgb(85, 119, 255);
    }

    #player5 {
        background-color: rgb(213, 92, 213);
    }

    #player6 {
        background-color: white;
    }

    #techbox {
        border-radius: 1rem;
        position: fixed;
        height: 31.5rem;
        width: 70rem;
        margin-left: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0rem 0.2rem 0.1rem 0rem rgba(0, 0, 0, 0.241);
        top: 10rem;
        left: 22rem;
        background-color: rgb(239, 239, 239);
        justify-content: center;
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
    }

    .subTitle {
        display: flex;
        justify-content: center;
        padding-top: 2rem;
    }

    .tC {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding-top: 1rem;
    }

    #checkBox {
        position: relative;
        top: 2rem;
        font-size: 1.2rem;
    }

    #cB {
        width: 1.2rem;
        height: 1.2rem;
    }

    #checkBoxBox {
        display: flex;
        margin-left: 0.8rem;
    }

    #rightArrow {
        position: absolute;
        top: 15rem;
        right: 5rem;
        width: 3rem;
        height: 3rem;
    }

    #leftArrow {
        position: absolute;
        top: 15rem;
        left: 5rem;
        width: 3rem;
        height: 3rem;
        transform: rotate(180deg);
    }

    #rightArrowButton {
        border: 0;
        outline: 0;
    }

    #leftArrowButton {
        border: 0;
        outline: 0;
    }

    #techbox p{
        margin: 0;
    }
</style>
