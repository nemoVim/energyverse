<div id="LP">
    <h1>딜러 로비</h1>
</div>
<form method="POST">
    <div id="ddd">
        <div id= 'eee'>

            <span>Password</span>
            <div id="content">
                
                <input type="password" name="password" placeholder="  Password">
                <button>Submit</button>    
            </div>
        </div>
    </div>
</form>
<style>
    #ddd {
        display: flex;
        justify-content: center;
    }
    #LP {
        display: flex;
        justify-content: center;
    }
    #eee {
        width: 60%;
        
    }
    span{
        margin-bottom: 5vh;
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

    #content { 
        display: flex;
        align-items: center;
        width: 100%;
        height: 15vh;
    }

    input {
        height: 6rem;
        width: 85%;
        font-size: 1.9rem;
        letter-spacing: 0.1rem;
        border-radius: 1rem 0rem 0rem 1rem;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        outline: none;
        box-sizing: border-box;
        border: solid black;
    }
    button {
        height:6rem;
        width: 15%;
        font-size: 1.8rem;
        letter-spacing: 0.1rem;
        background-color: #ffffff;
        border-radius: 0rem 1rem 1rem 0rem;
        border: solid black;
        border-left: none;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
    }
    button:hover{
        
        background-color: #ecfaff;
    }
    button:active {
        box-shadow: 0 0 0 1px #ffffff inset,
        0 0 0 2px rgba(255,255,255,0.15) inset,
        0 0 0 1px rgba(0,0,0,0.4);
    }

    span {
        font-size: 2rem;
        text-align: left;
    }

</style>

