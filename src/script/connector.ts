let plansza:Array<any>;

let wsUri:string = "ws://martaku.ct8.pl:7312/sockets/server.php";
let websocket = new WebSocket(wsUri);

export function send(txt:string) {
    var msg = {
        mainmsg: txt
    };
    websocket.send(JSON.stringify(msg));
}

export function init() {
    websocket.onopen = function (ev) { // connection is open
        console.log("open");
    }

    //#### Message received from server
    websocket.onmessage = function (ev) {
    if (ev.data != "")
        try {
            var msg = JSON.parse(ev.data); //PHP sends Json data
            console.log(msg);
            if(msg.plansza != undefined){
                plansza = msg.plansza;
            }
        } catch (error) {
            console.error(error);
            console.log(ev.data);
        }
    };

    websocket.onerror = function (ev) {
        console.log(ev);
    };

    document.getElementById("btn")?.addEventListener("click", ()=>{
        send("test");
    })
};

export function getPlansza() {
    return plansza;
}