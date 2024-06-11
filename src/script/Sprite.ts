interface Frame {
    x0: number;
    y0: number;
    w: number;
    h: number;
}

export default class Sprite{
    
    private static canvas:HTMLCanvasElement;
    private static ctx:CanvasRenderingContext2D;
    private static data:any;

    private spritesheet:CanvasImageSource;
    private sprite:string;
    private animType:string;
    private x:number;
    private y:number;
    private tickNumber:number = 0;
    private actFrame:number = 0;
    private frames:Frame[] = [];
    private times:Array<number> = [];
    private repeat:boolean = true;

    private requestId:any;

    constructor(sprite:string, animType:string, x:number, y:number){
        let img = new Image();
        img.src = "spritesheet.png";
        this.spritesheet = img;
        this.sprite = sprite;
        this.animType = animType;
        this.x = x;
        this.y = y;
        Sprite.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        Sprite.ctx = Sprite.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    private renderFrame(i:number) {
        Sprite.ctx.drawImage(this.spritesheet, this.frames[i].x0, this.frames[i].y0, this.frames[i].w, this.frames[i].h, this.x, this.y, this.frames[i].w, this.frames[i].h);
    }

    private goAnim() {
        this.renderFrame(this.actFrame)

        this.tickNumber++;
        if (this.tickNumber == this.times[this.actFrame]) { // rotacja klatek
            this.tickNumber = 0
            this.actFrame++;
        }
        if (this.actFrame >= this.frames.length) {
            if (this.repeat) {
                this.actFrame = 0; // zapętlenie
            } else {
                return; // stop animating if not repeating
            }
        }
        this.requestId = window.requestAnimationFrame(this.goAnim.bind(this));
    }

    public startAnim() {
        fetch("data.json")
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok ' + res.statusText);
                }
                return res.json();
            })
            .then(data => {
                // console.log('Data fetched successfully:', data);
                Sprite.data = data;
                const animData = data[this.sprite]?.[this.animType];
                if (animData) {
                    this.frames = animData.frames;
                    this.times = animData.times;
                    this.repeat = animData.repeat;
                    this.goAnim();
                } else {
                    throw new Error(`Animation data for sprite '${this.sprite}' and animType '${this.animType}' not found`);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    private animationRefresh(){
        window.cancelAnimationFrame(this.requestId);
        let data = Sprite.data;
        const animData = data[this.sprite]?.[this.animType];
        if (animData) {
            this.frames = animData.frames;
            this.times = animData.times;
            this.repeat = animData.repeat;
            this.goAnim();
        } else {
            throw new Error(`Animation data for sprite '${this.sprite}' and animType '${this.animType}' not found`);
        }
    }

    public move(pos:Array<number>){
        let x = pos[0] - this.x;
        let y = pos[1] - this.y;

        let fps = 0;
        
        if(x == 0){
            fps = y / 60;
            if(y > 0){
                this.animType = "right";
            }
            else{
                this.animType = "left";
            }
            this.animationRefresh();
        }
        else if(y == 0){
            fps = x / 60;
            if(x > 0){
                this.animType = "right";
            }
            else{
                this.animType = "left";
            }
            this.animationRefresh();
        }

        let inv = setInterval(()=>{
            // Sprite.ctx.clearRect(this.x, this.y, 16, 16)
            Sprite.ctx.clearRect(0, 0, 1000, 1000)

            if(x == 0){
                this.y += fps;
            }
            else if(y == 0){
                this.x += fps;
            }
        }, 1500/90);

        setTimeout(() => {
            clearInterval(inv)
            this.x = pos[0]
            this.y = pos[1]
        }, 1500);
    }
}