<div id="LP">
    <h1>딜러 로비</h1>
</div>
<form method="POST">
    <div id="ddd">
        <div id= 'eee'>
            <span>● 비밀번호</span>
            <div id="content">
                <input type="password" name="password" placeholder="Password">
                <button>확인</button>    
            </div>
        </div>
    </div>
</form>
<style>
    #ddd {
        display: flex;
        justify-content: center;
        margin-top: 5rem;
    }
    #LP {
        display: flex;
        justify-content: center;
    }
    #eee {
        width: 70%;
        
    }
    h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem 7rem;
        background-color: white;
        border: .7rem solid #37aad7;
        border-radius: 7rem;
        font-size: 3.5rem;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        margin: 2rem;
        margin-top: 5rem;
    }

    #content { 
        display: flex;
        align-items: center;
        height: 8rem;
    }

    input {
        height: 6rem;
        width: 82%;
        font-size: 1.9rem;
        letter-spacing: 0.1rem;
        border-radius: 1rem 0rem 0rem 1rem;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        outline: none;
        box-sizing: border-box;
        border: solid black .3rem;
        padding: .6rem 1.5rem;
    }

    button {
        height:6rem;
        width: 18%;
        font-size: 2.2rem;
        letter-spacing: 0.1rem;
        background-color: #f0f0f0;
        border-radius: 0rem 1rem 1rem 0rem;
        border: solid black .3rem;
        border-left: none;
        box-shadow: 0.3rem 0.3rem 0.3rem rgb(173, 173, 173);
        padding: 1rem;
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
        font-size: 2.4rem;
        text-align: left;
    }

</style>

