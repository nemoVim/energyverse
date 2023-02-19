<script>
    export let data;
    const roomList = data.roomList;
</script>
<body>
    <div id="LP">
        <h1>Dealer Page</h1>
    </div>
    
    <div id="ddd">
        <div class="row">
          <div class="left">
              <a id="create"href="/dealer/room">Create a room</a>
          </div>
            <span>Room List</span>
            <div class="right">
              {#each roomList as room}
                  <a class="room" href="/dealer/game/{room.title}">{room.title}</a>
              {/each}
            </div>
        </div>
    </div>
  </body>



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
    a {
        text-decoration-line: none;
        border: solid black;
        background-color: aqua;
        color: black;
        
    }

    div.row {
        font-size: 2rem;
        width: 90%;

      }
      div.left {
        width: 25%;
        float: left;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5rem;


      }
      div.right {
        width: 75%;
        float: right;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        background-color: bisque;
      }
    .room {
        width:20%;
        background-color: rgb(118, 209, 255);
        border: solid black;
        margin-left: 1rem;
        margin-right: 1rem;
        margin-bottom: 2rem;
        justify-content: center;
        display: flex;  

    }




</style>