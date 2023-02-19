<div id="LP">
        <h1>Create a room</h1>
</div>

<form method="POST">
    <div id="ddd"> 
        <div id="eee">
            <input id="title" type="text" name="title" placeholder=" Room Name" />
            <input id="dealer" type="text" name="dealer" placeholder=" Dealer Name" />
            
        </div>
        <button>Submit</button>
    
    </div>
</form>

<style>
    #LP {
        display: flex;
        justify-content: center;
    }

    h1 {
        display: flex;
        justify-content: center;
        font-size: 2.5rem;
        margin-bottom: 20vh;
        align-items: center;
        height: 6rem;
        border-radius: 15px;
        border: thick double #32a1ce;
        width: 40%;
        background-color: white;

    }
    #ddd {
        display: flex;
        justify-content: center;
    }
    #eee {
        width: 60%;
    }
    #title {
        border-radius: 1rem 0rem 0rem 0rem;
        border-bottom: none;
    }
    #dealer {
        border-radius: 0rem 0rem 0rem 1rem;

    }

    input {
        height: 6rem;
        width: 100%;
        font-size: 1.9rem;
        letter-spacing: 0.1rem;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        outline: none;
        box-sizing: border-box;
        border: solid black;
    }
    button {
        width: 15%;
        font-size: 1.8rem;
        letter-spacing: 0.1rem;
        background-color: #ffffff;
        border-radius: 0rem 1rem 1rem 0rem;
        border: solid black;
        border-left: none;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        font-size: 3rem;
    }
    button:hover {
        background-color: #ecfaff;
    }
    button:active {
        box-shadow: 0 0 0 1px #ffffff inset,
            0 0 0 2px rgba(255, 255, 255, 0.15) inset,
            0 0 0 1px rgba(0, 0, 0, 0.4);
    }


</style>
