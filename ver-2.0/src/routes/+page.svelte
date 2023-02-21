<script>
</script>

<div id="mt1">
    <h1 id="main_title">Energyverse Project 2.0</h1>
</div>
<div id="div_div_pl_dl">
    <div>
        <a href="./dealer" id="dl">딜러</a>
    </div>
    <div>
        <a href="./player" id="pl">플레이어</a>
    </div>
</div>

<p id="dark">ⓒ黑생회</p>

<style>
    h1 {
        font-size: 2.5rem;
    }
    #mt1 {
        display: flex;
        justify-content: center;
    }
    #main_title {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60%;
        background-color: white;
        height: 6rem;
        border: thick double #32a1ce;
        border-radius: 15px;
    }
    #div_div_pl_dl {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #div_div_pl_dl > div {
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35rem;
        height: 30rem;
        margin: 5rem;
        border: solid black 0.4rem;
        border-radius: 0.5rem;
        background-color: #ffffff;
    }

    #div_div_pl_dl > div:hover {
        background-color: #ecfaff;
    }

    #div_div_pl_dl > div:active {
        box-shadow: 0 0 0 1px #ffffff inset,
            0 0 0 2px rgba(255, 255, 255, 0.15) inset,
            0 0 0 1px rgba(0, 0, 0, 0.4);
    }

    #div_div_pl_dl > div > a {
        color: black;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        width: 100%;
        height: 100%;
        text-decoration-line: none;
    }
    #dark {
        font-family: 굴림;
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: .5rem;
        margin: 0;
        color: rgb(250, 250, 250);
    }
</style>
