<?php

class Plansza{

    private $plansza;

    public function __construct() {
        $this->plansza = [
            "player" => [[16,16]],
            "wall" => [
                "nonbreakable" => [],
                "breakable" => []
            ],
            "balloon" => [
                "right" => [],
                "left" => []
            ]
        ];
        $this->create();
    }

    private function arr_search($arr, $val){
        foreach ($arr as $key =>$value) {
            if ($value === $val) {
                return true;
            }
        }
        return false;
    }

    private function create(){
        # wall, nonbreakable
        for($i = 0; $i<16*31; $i+=16){ #top
            array_push($this->plansza["wall"]["nonbreakable"], [$i, 0]);
        }
        for($i = 0; $i<16*13; $i+=16){ #left
            array_push($this->plansza["wall"]["nonbreakable"], [0, $i]);
        }
        for($i = 0; $i<16*13; $i+=16){ #right
            array_push($this->plansza["wall"]["nonbreakable"], [16*31-16, $i]);
        }
        for($i = 0; $i<16*31; $i+=16){ #bottom
            array_push($this->plansza["wall"]["nonbreakable"], [$i, 16*13-16]);
        }
        for($i = 32; $i<16*31; $i+=32){ #center
            for($j = 32; $j<16*13; $j+=32){
                array_push($this->plansza["wall"]["nonbreakable"], [$i, $j]);
            }
        }

        # wall, breakable
        for($i = 16; $i<16*29; $i+=16){
            for($j = 16; $j<16*11; $j+=16){
                if(!$this->arr_search($this->plansza["wall"]["nonbreakable"], [$i, $j]) && !$this->arr_search($this->plansza["player"], [$i, $j])){
                    if(mt_rand(0,3) == 0){ #25%
                        array_push($this->plansza["wall"]["breakable"], [$i, $j]);
                    }
                }
            }
        }

        # balloon
        for($i = 16; $i<16*29; $i+=16){
            for($j = 16; $j<16*11; $j+=16){
                if(!$this->arr_search($this->plansza["wall"]["nonbreakable"], [$i, $j]) && !$this->arr_search($this->plansza["wall"]["breakable"], [$i, $j]) && !$this->arr_search($this->plansza["player"], [$i, $j])){
                    if(mt_rand(0,33) == 0){ #ok.3%
                        if(mt_rand(0,1) == 0){
                            array_push($this->plansza["balloon"]["right"], [$i, $j]);
                        }
                        else{
                            array_push($this->plansza["balloon"]["left"], [$i, $j]);
                        }
                    }
                }
            }
        }
    }

    public function get_plansza(){
        return $this->plansza; 
    }

    private function move_balloon($balloon, $i, $type){
        $x = $balloon[0];
        $y = $balloon[1];

        $moved = false;
        $arr = [];
        while(!$moved){
            $direction = rand(0,3);
            switch($direction){
                case 0: #right
                    if(!$this->arr_search($this->plansza["wall"]["nonbreakable"], [$x+16, $y]) && !$this->arr_search($this->plansza["wall"]["breakable"], [$x+16, $y]) && !$this->arr_search($this->plansza["balloon"]["right"], [$x+16, $y]) && !$this->arr_search($this->plansza["balloon"]["left"], [$x+16, $y])){
                        $this->plansza["balloon"][$type][$i][0] += 16;
                        $moved = true;
                    }
                    else{
                        if(!array_search(0, $arr)){
                            array_push($arr, 0);
                        }
                    }
                    break;
                case 1: #left
                    if(!$this->arr_search($this->plansza["wall"]["nonbreakable"], [$x-16, $y]) && !$this->arr_search($this->plansza["wall"]["breakable"], [$x-16, $y]) && !$this->arr_search($this->plansza["balloon"]["right"], [$x-16, $y]) && !$this->arr_search($this->plansza["balloon"]["left"], [$x-16, $y])){
                        $this->plansza["balloon"][$type][$i][0] -= 16;
                        $moved = true;
                    }
                    else{
                        if(!array_search(1, $arr)){
                            array_push($arr, 1);
                        }
                    }
                    break;
                case 2: #top
                    if(!$this->arr_search($this->plansza["wall"]["nonbreakable"], [$x, $y+16]) && !$this->arr_search($this->plansza["wall"]["breakable"], [$x, $y+16]) && !$this->arr_search($this->plansza["balloon"]["right"], [$x, $y+16]) && !$this->arr_search($this->plansza["balloon"]["left"], [$x, $y+16])){
                        $this->plansza["balloon"][$type][$i][1] += 16;
                        $moved = true;
                    }
                    else{
                        if(!array_search(2, $arr)){
                            array_push($arr, 2);
                        }
                    }
                    break;
                case 3: #bottom
                    if(!$this->arr_search($this->plansza["wall"]["nonbreakable"], [$x, $y-16]) && !$this->arr_search($this->plansza["wall"]["breakable"], [$x, $y-16]) && !$this->arr_search($this->plansza["balloon"]["right"], [$x, $y-16]) && !$this->arr_search($this->plansza["balloon"]["left"], [$x, $y-16])){
                        $this->plansza["balloon"][$type][$i][1] -= 16;
                        $moved = true;
                    }
                    else{
                        if(!array_search(2, $arr)){
                            array_push($arr, 2);
                        }
                    }
                    break;
            }

            if(count($arr) == 4){
                $moved = true;
            }
        }
    }

    public function start_move(){
        $len_r = count($this->plansza["balloon"]["right"]);
        for($i = 0; $i < $len_r; $i++){
            $this->move_balloon($this->plansza["balloon"]["right"][$i], $i, "right");
        }
        $len_l = count($this->plansza["balloon"]["left"]);
        for($i = 0; $i < $len_l; $i++){
            $this->move_balloon($this->plansza["balloon"]["left"][$i], $i, "left");
        }
    }
}