import Sprite from "./Sprite";
import {send} from "./connector";

export default class Plansza{

    private walls:Array<Sprite> = [];
    private balloons:Array<Sprite> = [];

    private static canvas:HTMLCanvasElement;
    private static ctx:CanvasRenderingContext2D;

    constructor(jsonek:any){
        Plansza.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        Plansza.ctx = Plansza.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.generate(jsonek);
    }

    public generate(jsonek:any){
        Plansza.ctx.clearRect(0, 0, 496, 208);
        this.walls = [];
        this.balloons = [];
        if(jsonek.player){
            let pos = jsonek.player[0];
            let sprite = new Sprite("player", "right", pos[0], pos[1]);
            sprite.startAnim();
        }
        if(jsonek.wall){
            if(jsonek.wall.nonbreakable){
                let array = jsonek.wall.nonbreakable;
                for(let i = 0; i<array.length; i++){
                    let pos = array[i];
                    let sprite = new Sprite("wall", "nonbreakable", pos[0], pos[1]);
                    this.walls.push(sprite);
                    sprite.startAnim();
                }
            }
            if(jsonek.wall.breakable){
                let array = jsonek.wall.breakable;
                for(let i = 0; i<array.length; i++){
                    let pos = array[i];
                    let sprite = new Sprite("wall", "breakable", pos[0], pos[1]);
                    this.walls.push(sprite);
                    sprite.startAnim();
                }
            }
        }
        if(jsonek.balloon){
            if(jsonek.balloon.right){
                let array = jsonek.balloon.right;
                for(let i = 0; i<array.length; i++){
                    // console.log('r');
                    let pos = array[i];
                    let sprite = new Sprite("balloon", "right", pos[0], pos[1]);
                    this.balloons.push(sprite);
                    sprite.startAnim();
                }
            }
            if(jsonek.balloon.left){
                let array = jsonek.balloon.left;
                for(let i = 0; i<array.length; i++){
                    // console.log('l');
                    let pos = array[i];
                    let sprite = new Sprite("balloon", "left", pos[0], pos[1]);
                    this.balloons.push(sprite);
                    sprite.startAnim();
                }
            }
        }

        setTimeout(()=>{

            send("loaded");
            Plansza.canvas.style.display = "block";
            
        },1000)

    }

    public update(jsonek:any){
        Plansza.ctx.clearRect(0, 0, 496, 208);

        let numOfRight = 0;
        let numOfLeft = 0;
        if(jsonek.balloon){
            if(jsonek.balloon.right){
                let array = jsonek.balloon.right;
                numOfRight += array.length;
                for(let i = 0; i<array.length; i++){
                    let pos = array[i];
                    this.balloons[i].move(pos);
                }
            }
            if(jsonek.balloon.left){
                let array = jsonek.balloon.left;
                numOfLeft += array.length;
                for(let i = 0; i<array.length; i++){
                    let pos = array[i];
                    if(numOfRight == 0){
                        this.balloons[i].move(pos);
                    }
                    else{
                        this.balloons[i+numOfRight].move(pos);
                    }
                }
            }
        }
    }
}