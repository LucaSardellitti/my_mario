// https://developer.mozilla.org/fr/docs/Web/JavaScript/Introduction_%C3%A0_JavaScript_orient%C3%A9_objet

var divMap = document.createElement("div");
divMap.setAttribute("id", "map");
document.body.appendChild(divMap);

var Cell = function (y, x, image, my_class, alt) {
    this.x = x;
    this.y =  y;
    var img = document.createElement("img");
    img.setAttribute("src", image);
    img.setAttribute("alt", alt);
    img.setAttribute("class", my_class);
    img.style.transition = "all 0.3s";
    this.image = img;
    // crÃ©e un Ã©lÃ©ment img et l'insÃ¨re dans le DOM aux coordonnÃ©es x et y
    this.update = function () {
        // met Ã  jour la position de la cellule dans le DOM
        this.image.style.left = this.x * 22.5 + "px";
        this.image.style.top = this.y * 26.5 + "px";
    };
    this.checkCollision = function (cell) {
        // retourne true si la cellule est aux mÃªme coordonnÃ©es que cell
    };
    this.die = function () {
        // dÃ©truit l'objet et le remove de la map
    };
};

var Mario = function (y, x, image, my_class, alt) {
    // Mario hérite de Cell
    Cell.call(this, y, x, image, my_class, alt); 
    this.falling = false;
    this.killGoomba = 0;
    this.killBowser = 0;
    this.input = new Input(['ArrowLeft', 'ArrowRight', 'Space']);
    this.power = 0;
    this.makeJump = function () {
        // mario monte d'une case s'il le peut et s'il lui reste du power
        // s'il ne le peut pas, il met fin à l'intervalle de temps entre chaque animation du saut
        // mario met à jour le dom à chaque animation de saut
        // si mario saute dans un koopa, mario meurt
    };
    this.fall = function () {
        // mario se déplace d'une cellule vers le bas s'il le peut et met falling à true
        // si mario tombe sur un koopa, le koopa meurt
       if (mario.power === 0) {
            mario.y++;
            this.image.src = "../img/marioJump.png";
            for(var i = 0; i < map.posKoopa.length; i++){
                var posKoopaI = map.posKoopa[i];
                if (mario.y+1 == posKoopaI.y && mario.x == posKoopaI.x) {
                    posKoopaI.injury();
                }
            }
            for(var i = 0; i < map.posGoomba.length; i++){
                var posGoombaI = map.posGoomba[i];
                if (mario.y+1 == posGoombaI.y && mario.x == posGoombaI.x) {
                    this.killGoomba++;
                    posGoombaI.die();
                }
            }
            for(var i = 0; i < map.posBowser.length; i++){
                var posBowserI = map.posBowser[i];
                if (mario.y+1 == posBowserI.y && mario.x == posBowserI.x) {
                    this.killBowser++;
                    console.log(this.killBowser);
                }
            }

            if (this.killGoomba == map.posGoomba.length) {
                mario.win();
            }
            if (this.killBowser == 3) {
                posBowserI.die()
                mario.win();
            }

           if(map.checkCollisionDownTop(mario)){
            mario.y--;
            this.image.src = "../img/mario.png";
           }
       }
       this.falling = true;
    };
    this.die = function () {
        // mario met fin à son intervalle d'animations
        // mario est retiré de la map
        clearInterval(mario.interval);
        this.image.remove();
        var GO = document.createElement("img");
        GO.setAttribute("id", "gameOver");
        GO.setAttribute("alt", "image gameOver");
        GO.setAttribute("src", "../img/GameOver.png");
        document.getElementById("map").style.background = "url('"+GO.src+"')";
        document.getElementById("map").style.backgroundSize = "99% 100%";
        document.getElementById("map").style.backgroundPosition = "absolute";
        document.getElementById("map").style.backgroundRepeat = "no-repeat";
        document.body.appendChild(divMap);
    };
    this.win = function () {
        // mario met fin à son intervalle d'animations
        clearInterval(mario.interval);
        this.image.src = "../img/marioVictory.png";
        this.image.style.marginTop = "-5px";
        var W = document.createElement("img");
        W.setAttribute("id", "win");
        W.setAttribute("alt", "image win");
        W.setAttribute("src", "../img/MarioWin.png");
        document.getElementById("map").style.background = "url('"+W.src+"')";
        document.getElementById("map").style.backgroundSize = "99% 100%";
        document.getElementById("map").style.backgroundPosition = "absolute";
        document.getElementById("map").style.backgroundRepeat = "no-repeat";
        document.body.appendChild(divMap);
    };
    this.move = function () {
        // si l'Input est flèche de gauche, mario se déplace à gauche s'il le peut
        // si l'Input est flèche de droite, mario se déplace à droite s'il le peut
        // si l'Input est espace, mario commence un saut
        var tabInput = this.input.keys;//recuperation de mon tableau qui est dans ma classe Input
        for (var i = 0; i < tabInput.length; i++) {//je parcour le tableau.
            var valueTab = tabInput[i];//valueTab sera egale a une valeur du tableau à chaques tours de boucle
            if (valueTab == "ArrowLeft") {
                if (map.checkCollisionLeft(mario)) {
                    mario.x++;
                }
                this.image.style.transform = "rotateY(180deg)";
                mario.x--;
            }
            if(valueTab == "ArrowRight") {
                if (map.checkCollisionRight(mario)) {
                    mario.x--;
                }
               this.image.style.transform = "rotateY(360deg)";
                mario.x++;
            }
            if(valueTab == "Space" && !map.checkCollisionDownTop(mario)) {
                if(mario.power === 0){
                    mario.power = 3;
                    this.image.src = "../img/marioJump.png";
                }
            }
        }
        if (mario.power > 0) {
            mario.y--;
            mario.power--;
        }
        this.input.keys = [];

        // si mario rencontre un ennemi après son déplacement, il meurt
        var retour = map.checkCollisionEnnemi(mario);
        if (retour instanceof Koopa) {
            mario.die();
        }
        if (retour instanceof Boo) {
            mario.die();
        }
        if (retour instanceof Goomba) {
            mario.die();
        }
         if (retour instanceof Bowser) {
            mario.die();
        }

        var retourTop = map.checkCollisionDownTop(mario);
        if (retourTop instanceof Cell) {
            mario.y++;
        }

        var retourLeft = map.checkCollisionLeft(mario);
        if (retourLeft instanceof Peach) {
            mario.win();
        }

        var retourRight = map.checkCollisionRight(mario);
        if (retourRight instanceof Peach) {
            mario.win();
        }
    };

    var mario = this;
    this.interval = setInterval(function () {
    mario.fall();
    mario.move();
    mario.update();
}, 100);
};

var Peach = function (y, x, image, my_class, alt) {
    Cell.call(this, y, x, image, my_class, alt);

    this.moveLeft = function () {
          setInterval(function(){ document.getElementsByClassName("peach")[0].style.transform = "rotateY(180deg)"; }, 1000);
    };
    this.moveRight = function () {
          setInterval(function(){ document.getElementsByClassName("peach")[0].style.transform = "rotateY(360deg)"; }, 500);
    };
    var peach = this;
    this.interval = setInterval(function () {
        peach.moveRight();
        peach.moveLeft();
    }, 1000);
}
 
var Goomba = function (y, x, image, my_class, alt) {
    // Goomba hérite de Cell
    Cell.call(this, y, x, image, my_class, alt);
    this.power = 0;
    this.direction = 'left';
    this.die = function() {
        // goomba met fin à son intervalle d'animations
        // goomba est retiré de la map
        clearInterval(goomba.interval);
        this.x = -1;
        this.y = -1
        this.image.remove();
    };
    this.move = function () {
        // goomba se déplace en direction de direction s'il le peut
        // sinon il change de direction
        if (goomba.direction == 'left') {
            goomba.x--;
        }
        if (goomba.direction == 'right') {
            goomba.x++;
        }

        var retour = map.checkCollisionWall(goomba);
        if (retour instanceof Cell) {
            if (goomba.direction == "left") {
                goomba.direction = "right";
                 this.image.style.transform = "rotateY(360deg)";
            }
            else{
                goomba.direction = "left";
                 this.image.style.transform = "rotateY(180deg)";
            }
        }
    };
        // goomba se déplace d'une cellule vers le bas s'il le peut
    this.fall = function () {
         if (goomba.power === 0) {
            goomba.y++;
           if(map.checkCollisionDownTop(goomba)){
            goomba.y--;
           }
       }
    };
    var goomba = this;
    this.interval = setInterval(function () {
        goomba.fall();
        goomba.move();
        goomba.update();
    }, 200);
}

var Koopa = function (y, x, image, my_class, alt) {
    // Koopa hérite de Cell
    Cell.call(this, y, x, image, my_class, alt);
    this.power = 0;
    this.direction = 'left';
    this.changeImage = function(){
            this.image.src = "../img/koopa.png";
    }
    this.injury = function() {
        this.image.src = "../img/carapace.png";
        clearInterval(koopa.interval);

        setTimeout(function(){
            this.interval = setInterval(function () {
             koopa.changeImage();
             koopa.fall();
             koopa.move();
             koopa.update();
            }, 200);
        }, 5000);
    };
    this.move = function () {
        // koopa se déplace en direction de direction s'il le peut
        // sinon il change de direction
        if (koopa.direction == 'left') {
            koopa.x--;
        }
        if (koopa.direction == 'right') {
            koopa.x++;
        }

        var retour = map.checkCollisionWall(koopa);
        if (retour instanceof Cell) {
            if (koopa.direction == "left") {
                koopa.direction = "right";
                this.image.style.transform = "rotateY(180deg)";
            }
            else{
                koopa.direction = "left";
                this.image.style.transform = "rotateY(360deg)";
            }
        }
    };
        // koopa se déplace d'une cellule vers le bas s'il le peut
    this.fall = function () {
         if (koopa.power === 0) {
            koopa.y++;
           if(map.checkCollisionDownTop(koopa)){
            koopa.y--;
           }
       }
    };
    var koopa = this;
    this.interval = setInterval(function () {
        koopa.fall();
        koopa.move();
        koopa.update();
    }, 200);
}

var Boo = function (y, x, image, my_class, alt) {
    Cell.call(this, y, x, image, my_class, alt);
    this.direction = 'left';
    this.move = function () {
        if (boo.direction == 'left') {
            boo.x--;
            this.image.style.transform = "rotateY(180deg)";
        }
        if (boo.direction == 'right') {
            boo.x++;
            this.image.style.transform = "rotateY(360deg)";
        }

        if (boo.x == 0) {
            boo.x++;
             if (boo.direction == "left") {
            boo.direction = "right";
            }
            else{
                boo.direction = "left";
            }
        }
        if (boo.x == 67) {
            boo.x--;
            if (boo.direction == "left") {
                boo.direction = "right";
            }
            else{
                boo.direction = "left";
            }
        }
    };

    var boo = this;
    this.interval = setInterval(function () {
        boo.move();
        boo.update();
    }, 200);
}

var Bowser = function (y, x, image, my_class, alt) {
    Cell.call(this, y, x, image, my_class, alt);
    this.power = 0;
    this.falling = false;
    this.direction = 'left';

     this.die = function() {
        clearInterval(bowser.interval);
        this.image.remove();
    };
    this.move = function () {
        if (bowser.direction == 'left') {
            bowser.x--;
        }
        if (bowser.direction == 'right') {
            bowser.x++;
        }
        // if(bowser.power === 0){
        //     // setInterval(function(){
        //         bowser.power = 3;
        //     // }, 3000);
        // }
        // if (bowser.power > 0) {
        //     bowser.y--;
        //     bowser.power--;
        // }

        var retour = map.checkCollisionWall(bowser);
        if (retour instanceof Cell) {
            if (bowser.direction == "left") {
                bowser.direction = "right";
                this.image.style.transform = "rotateY(180deg)";
            }
            else{
                bowser.direction = "left";
                this.image.style.transform = "rotateY(360deg)";
            }
        }
    };
        // bowser se déplace d'une cellule vers le bas s'il le peut
    this.fall = function () {
        if (bowser.power === 0) {
            bowser.y++;
           if(map.checkCollisionDownTop(bowser)){
            bowser.y--;
           }
       }
       this.falling = true;
    };
    var bowser = this;
    this.interval = setInterval(function () {
        bowser.fall();
        bowser.move();
        bowser.update();
    }, 200);
}

var Input = function (keys) {
    // Input récupère les touches actives du clavier
    this.keys = [];
    thisClass = this;//thisClass représente ici la class Input.
       document.addEventListener("keydown", function(e) {
            if(e.code == "ArrowLeft"){
               thisClass.keys.push(e.code);
            }
            else if (e.code == "ArrowRight"){
                thisClass.keys.push(e.code);
            }
            else if (e.code == "Space"){
                thisClass.keys.push(e.code);
            }
      });
}

var Map = function (model) {
    this.map = [];
    this.posKoopa = [];
    this.posGoomba = [];
    this.posBowser = [];
    this.generateMap = function () {
        // instancie les classes correspondants au schema
        // avec :
        //      w => Cell
        //      k => Koopa
        //      m => Mario

        for (var x = 0; x < model.length; x++) {
            var divLigne = document.createElement("div");
            divLigne.classList.add("ligne");
            for (var y = 0; y < model[x].length; y++) {
                if(model[x][y] == "w"){ 
                    var murs = new Cell(x, y, '../img/block.png', "murs", "les murs");
                    divLigne.appendChild(murs.image);
                    this.map.push(murs);
                }
                else if(model[x][y] == "k"){
                    var koopa = new Koopa(x, y, '../img/koopa.png', "koopa", "les koopa");
                    divLigne.appendChild(koopa.image);
                    this.map.push(koopa);
                    this.posKoopa.push(koopa);

                    var vide = new Cell(x, y, '../img/vide.png', "vide", "les murs vide");
                    divLigne.appendChild(vide.image);
                }
                else if(model[x][y] == "b"){
                    var boo = new Boo(x, y, '../img/boo.png', "boo", "les boo");
                    divLigne.appendChild(boo.image);
                    this.map.push(boo);

                    var vide = new Cell(x, y, '../img/vide.png', "vide", "les murs vide");
                    divLigne.appendChild(vide.image);
                }
                else if(model[x][y] == "g"){
                    var goomba = new Goomba(x, y, '../img/goomba.png', "goomba", "les goombas");
                    divLigne.appendChild(goomba.image);
                    this.map.push(goomba);
                    this.posGoomba.push(goomba);

                    var vide = new Cell(x, y, '../img/vide.png', "vide", "les murs vide");
                    divLigne.appendChild(vide.image);
                }
                else if(model[x][y] == "m"){
                    var mario = new Mario(x, y, '../img/mario.png', "mario", "mon mario");
                    divLigne.appendChild(mario.image);
                    this.map.push(mario);

                    var vide = new Cell(x, y, '../img/vide.png', "vide", "les murs vide");
                    divLigne.appendChild(vide.image);
                }
                else if(model[x][y] == "p") {
                    var peach = new Peach(x, y, "../img/peach.png", "peach", "ma peach");
                    divLigne.appendChild(peach.image);
                    this.map.push(peach);

                    var vide = new Cell(x, y, '../img/vide.png', "vide", "les murs vide");
                    divLigne.appendChild(vide.image);
                }
                else if(model[x][y] == "B") {
                    var bowser = new Bowser(x, y, "../img/bowser.png", "bowser", "le boss bowser");
                    divLigne.appendChild(bowser.image);
                    this.map.push(bowser);
                    this.posBowser.push(bowser);

                    var vide = new Cell(x, y, '../img/vide.png', "vide", "les murs vide");
                    divLigne.appendChild(vide.image);
                }
                else{
                     var vide = new Cell(x, y, '../img/vide.png', "vide", "les murs vide");
                     divLigne.appendChild(vide.image);
                }
            }
            divMap.appendChild(divLigne);
        }
    };

    this.checkCollisionWall = function (cell) {
        // parcourt la map et renvoie la cellule aux mÃªmes coordonnÃ©es que cell
        for (var i = 0; i < this.map.length; i++) {
            var otherCell = this.map[i];//Nouvelles cellule a chaque tour de boucle
            //Condition pour que les koopas n'ont pas les meme coordonnée que les murs mais les coordonnée d'a coté.
            if (cell.x+1 === otherCell.x && cell.y === otherCell.y && cell !== otherCell) {
                return otherCell;
            }
            if (cell.x-1 === otherCell.x && cell.y === otherCell.y && cell !== otherCell) {
                return otherCell;
            }
         }
         return false;
    };
    this.checkCollisionRight = function (cell) {
        // parcourt la map et renvoie la cellule aux mÃªmes coordonnÃ©es que cell
        for (var i = 0; i < this.map.length; i++) {
            var otherCell = this.map[i];//Nouvelles cellule a chaque tour de boucle
            //Condition pour que MARIO n'ai pas les meme coordonnée que les murs mais les coordonnée d'a coté.
            if (cell.x+1 === otherCell.x && cell.y === otherCell.y && cell !== otherCell) {
                return otherCell;
            }
         }
         return false;
    };
    this.checkCollisionLeft = function (cell) {
        // parcourt la map et renvoie la cellule aux mÃªmes coordonnÃ©es que cell
        for (var i = 0; i < this.map.length; i++) {
            var otherCell = this.map[i];//Nouvelles cellule a chaque tour de boucle
            //Condition pour que MARIO n'ai pas les meme coordonnée que les murs mais les coordonnée d'a coté.
            if (cell.x-1 === otherCell.x && cell.y === otherCell.y && cell !== otherCell) {
                return otherCell;
            }
         }
         return false;
    };
    this.checkCollisionDownTop = function (cell) {
        // parcourt la map et renvoie la cellule aux mÃªmes coordonnÃ©es que cell
        for (var i = 0; i < this.map.length; i++) {
            var otherCell = this.map[i];//Nouvelles cellule a chaque tour de boucle
            if (cell.x === otherCell.x && cell.y === otherCell.y && cell !== otherCell) {
                return otherCell;
            }
        }
         return false;
    };
    this.checkCollisionEnnemi = function (cell) {
        // parcourt la map et renvoie la cellule aux mÃªmes coordonnÃ©es que cell
        for (var i = 0; i < this.map.length; i++) {
            var otherCell = this.map[i];//Nouvelles cellule a chaque tour de boucle
            if (cell.x === otherCell.x && cell.y === otherCell.y && cell !== otherCell) {
                return otherCell;
            }
        }
         return false;
    };
    this.delete = function (cell) {
        // retire la cell de map
        // retire la cell du dom
        // delete la cell
    };
};

// var schema = [
//     'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
//     'w                                      w',
//     'w                                 k    w',
//     'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww    w',
//     'w                                      w',
//     'w                                      w',
//     'w                                      w',
//     'w                                      w',
//     'w                                      w',
//     'w          k    w                      w',
//     'wwwwwwwwwwwwwwwww                      w',
//     'w                   w           k      w',
//     'w            wwwww  wwwwwwwwwwwwwwwwwwww',
//     'w            w                         w',
//     'w           ww                         w',
//     'w          www                         w',
//     'w         wwww                         w',
//     'wm       wwwww k     w      k          w',
//     'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
// ];


// var newSchema = [
//     'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
//     'w                                      w',
//     'wp                               k     w',
//     'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww   w',
//     'w      b                               w',
//     'w                            wwww    w w',
//     'w                        wwww   w      w',
//     'w                  www          wwwwwwww',
//     'w                ww    wwww            w',
//     'w          g    w        www           w',
//     'wwwwwwwwwwwwwwwww     www              w',
//     'w                   w           k      w',
//     'w            wwwww  wwwwwwwwwwwwwwwwwwww',
//     'w            w                         w',
//     'w           ww                         w',
//     'w          www                         w',
//     'w         wwww                         w',
//     'wm     g wwwww k     w                Bw',
//     'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
// ];

var newSchema2 = [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w          b                                                      w',
    'w                                                                 w',
    'w                                                          w    g w',
    'w  ww                         wwwwwww  www  w   g  B       w   wwww',
    'w                           www     w       wwwwwwwwwwwwwwww      w',
    'w             w         w           w                      wwww   w',
    'w             wwww      ww  g       w                      w      w',
    'w                       wwwww       w                      w   wwww',
    'w     www               wwwwwww     w       b              w      w',
    'w                                 www                      wwww   w',
    'w                              wwwwww        w   k   w     w      w',
    'w                             wwwwwww        wwwwwwwwwwwwwww    wwww',
    'w w          g   w     k  w                                w      w',
    'w wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww                     w      w',
    'w                                    wwwww  w              wwww   w',
    'w                            b           wwww              w      w',
    'w                                           www            w   wwww',
    'ww   wwww                                     ww           w      w',
    'www                     gw                    wwww         wwww   w',
    'wwwww    g     wwww wwwwww                    wwwwww       w      w',
    'wwwwwwwww     ww                                           w   wwww',
    'w            www          wwwwwwwww              wwwwww    w b    w',
    'w          wwwww                                      ww   w      w',
    'wm        wwwwww          k                    k          ww     pw',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
];
var map = new Map(newSchema2);
map.generateMap();