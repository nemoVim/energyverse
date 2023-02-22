<script>
    import logo from '$lib/assets/logo.png';
</script>

<div id="mt1">
    <div>
    <div id="imgDiv">
        <img id="logoImg" src={logo} alt="logo">
        <p>ver. 2.0</p>
    </div>
</div>
</div>

<div id="btnContainer">
    <div>
        <a href="./dealer">딜러</a>
    </div>
    <div>
        <a href="./player">플레이어</a>
    </div>
</div>

<p id="dark">ⓒ黑생회</p>

<style>

    #logoImg {
        width: 35rem;
    }

    #mt1 {
        display: flex;
        justify-content: center;
        margin: 2rem;
        margin-top: 5rem;

    }

    #imgDiv {
        position: relative;
        display: flex;
        justify-content: center;
        top: -.8rem;
        right: .2rem;
    }

    #imgDiv > p {
        position: absolute;
        bottom: -3rem;
        right: -.5rem;
        /* right: 0; */
        font-size: 2rem;
        color: #006ab6;
        font-weight: bold;
    }

    #mt1 > div {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem 7rem;
        background-color: white;
        border: .7rem solid #37aad7;
        border-radius: 7rem;
        font-size: 3.5rem;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
    }

    #btnContainer {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #btnContainer > div {
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35rem;
        height: 25rem;
        margin: 4rem;
        border: solid black 0.7rem;
        border-radius: 1rem;
        background-color: #ffffff;
    }

    #btnContainer > div:hover {

        background-color: #e8f8ff;
    }

    #btnContainer > div:active {
        box-shadow: 0 0 0 1px #ffffff inset,
            0 0 0 2px rgba(255, 255, 255, 0.15) inset,
            0 0 0 1px rgba(0, 0, 0, 0.4);
    }

    #btnContainer > div > a {
        color: black;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 4.5rem;
        width: 100%;
        height: 100%;
        text-decoration-line: none;
    }
    #dark {
        font-family: 굴림;
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 0.5rem;
        margin: 0;
        color: rgb(250, 250, 250);
    }
</style>
