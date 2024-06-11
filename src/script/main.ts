import {init, getPlansza} from "./connector";
import Plansza from "./Plansza";

init();

setTimeout(()=>{
    var plansza = getPlansza();
    // console.log(plansza);

    var p = new Plansza(plansza);

    setInterval(()=>{
        plansza = getPlansza();

        p.update(plansza);

    }, 2000)

}, 1000)