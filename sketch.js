 class Block{
 
  constructor(x, y, c){
  this.x = x;
  this.y = y;
  this.c = c;
  }
  
  DrawWithColor(){
    fill(this.c);
    square(this.x,this.y,BlockSize);
  }
   DrawWithNoColor(){
    square(this.x,this.y,BlockSize);
  }
}
 
 class Pavaring{
   
   constructor(x,y,shape, targety, c){
   this.x = x;
   this.y = y;
   this.targety = targety;
   
   this.shape = new Array(shape.length);
   for (var i=0;i<shape.length;i++){
     this.shape[i] = new Array(shape[0].length);
   }
   this.c = c;
   
   for (i=0;i<shape.length;i++){
     for (var j=0;j<shape[0].length;j++){
       this.shape[i][j] = shape[i][j];
       }
     }
   
   }
   
   draw(){
     for (var i=0;i<this.shape.length;i++){
     for (var j=0;j<this.shape[0].length;j++){
       if (this.shape[i][j] == 1){
       fill(this.c);
       var blockx = this.x+BlockSize*j;
       var blocky = this.y+BlockSize*i;
       if (blocky <250){
         continue;
       }
       square(blockx, blocky, BlockSize);
       }
       }
     }
   }
    drop(){
     if (this.y >= this.targety){
       return;
     }
     this.y += BlockSize;
   }
 
 }
 
 class Alphabet{
   
   constructor( x, y, c, offset, shape){
   this.x = x;
   this.y = y;
   this.c = c;
   this.offset = offset;
   this.pivot = 0;
   this.isErased = false;
   this.isHovered = false;
   this.wasHovered = false;
   
   this.floatingv = makeFloatVelocity(offset);
   this.r = Math.round(random(0,this.floatingv.length));
   
   
   this.blocks = new Array(shape.length)
   this.col = shape.length;
   this.row = shape[0].length;

   for (var i=0;i<shape.length;i++){
        this.blocks[i] = new Array(shape[0].length);
   }
   this.y += sumList(this.floatingv,this.r);
   for (i=0;i<shape.length;i++){
     for (var j=0;j<shape[i].length;j++){
       if (shape[i][j] == 1){
            this.blocks[i][j] = new Block(x+BlockSize*j,this.y+BlockSize*i,c);
       }else{
            this.blocks[i][j] = null;
       }
     }
   }
   }
   
    draw(){ 
    fill(this.c); 
    this.floating();
    for (var i=0;i<this.blocks.length;i++){
      for (var j=0;j<this.blocks[i].length;j++){
        if (this.blocks[i][j] != null){
          this.blocks[i][j].DrawWithNoColor();
        }
      }
    }
   }
   
   floating(){
     this.y = this.y + this.floatingv[this.r];    
     for (var i=0;i<this.blocks.length;i++){
      for (var j=0;j<this.blocks[i].length;j++){
        if (this.blocks[i][j] != null){
          
          this.blocks[i][j].y += this.floatingv[this.r];
          
        }
      }
    }
    this.r = (this.r+1)%this.floatingv.length;
   }
 
   
   erase(){
     this.isErased = true;
   }
   erase_block(){
     if (this.pivot == this.blocks.length * this.blocks[0].length){
       return;
     }
     this.blocks[Math.floor(this.pivot/this.blocks[0].length)][Math.floor(this.pivot%this.blocks[0].length)] = null;
     while(this.pivot < -1 + this.blocks.length * this.blocks[0].length){
       this.pivot++;
       console.log(this.pivot+" "+this.blocks.length+" " +this.blocks[0].length);
       if (this.blocks[Math.floor(this.pivot/this.blocks[0].length)][Math.floor(this.pivot%this.blocks.length)] != null){
         break;
       }
     }
   }
   checkHovered(){
   if (mouseX >=this.x && mouseX <=this.x+BlockSize*this.blocks[0].length &&  mouseY >= this.y && mouseY <=this.y+BlockSize*this.blocks.length){
     this.isHovered = true;
   }else{
     this.isHovered = false;
   }
 }
 }
 
 var img;
 var alphabets = new Array(6);
 var pavars = new Array(19); //backgroundblock[][][]의 길이랑 같아야 함!!
 var backgroundblocks = new Array(18);   

var BlockSize = 11;
var BlockSizePavar = 20;
 
var backgroundpavarX = [130,130+11*BlockSize,130+20*BlockSize,130+36*BlockSize, 130,130+5*BlockSize,130+30*BlockSize, 130,130+6*BlockSize,130+10*BlockSize,130+8*BlockSize,130+25*BlockSize,130+30*BlockSize,130+30*BlockSize,130+44*BlockSize, 130,130+13*BlockSize,130+7*BlockSize,130+27*BlockSize];
 var backgroundpavarY = 150;

 
 var pavartimer = 0;
 var pavarcurindex = -1;

 var targetY = [750,750,750,750+BlockSize,750-6*BlockSize,750-6*BlockSize,750-6*BlockSize,750-26*BlockSize,750-17*BlockSize, 750-18*BlockSize,750-26*BlockSize, 750-20*BlockSize, 750-26*BlockSize,750-15*BlockSize,750-26*BlockSize,750-38*BlockSize,750-33*BlockSize,750-36*BlockSize,750-32*BlockSize];
 var isStartedDropping = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
 var pavarcount = -1;
 var pavarcountperclick = 4;

var padd_x = 120;
var padd_y = 150;
var offset = 10;

var alphabet_x =[padd_x,padd_x+100,padd_x+200,padd_x+300,padd_x+400,padd_x+500];



var alphabet_c = new Array(6);
 
var pavar_c = new Array(30)
var pavar_shape= new Array(30);
for (var i=0;i<30;i++){
  pavar_c[i] = new Array(30);
}
for (i=0;i<30;i++){
  pavar_shape[i] = new Array(30);
}

function setup(){
  createCanvas(1000,1000);
  img = loadImage("Blocks.png");
  frameRate(30);
  
  let a1 =color(68,91,158);
let a2 =color(30,30,24);
let a3 =color(106,95,74);
let a4 =color(234,202,177);
let a5 =color(157,156,151);
let a6 =color(57,42,31);
  alphabet_c[0] = a1;
  alphabet_c[1] = a2;
  alphabet_c[2] = a3;
  alphabet_c[3] = a4;
  alphabet_c[4] = a5;
   alphabet_c[5] = a6;
  
 
   for (var i=0;i<30;i++){
    for (var j=0;j<30;j++){
      pavar_c[i][j] = color(random(0,256),random(0,256), random(0,256));
      pavar_shape[i][j] = random(0,6);
    }
   }
   
   for (i=0;i<alphabets.length;i++){
    alphabets[i] = new Alphabet(alphabet_x[i],padd_y,alphabet_c[i],offset,alphabet_shape[i]);
    alphabets[i].id = i;
 }
   for(i = 0; i < backgroundblock.length; i ++){
    pavars[i] = new Pavaring(backgroundpavarX[i],backgroundpavarY,backgroundblock[i],targetY[i],color(255,i*10,255-i*10));
  
  }
   

}

function draw(){
   background(0);
   //image(img, 0, 0);
   
   for (var i=0;i<alphabets.length;i++){
     alphabets[i].wasHovered = alphabets[i].isHovered;
   }
   
   for (i=0;i<alphabets.length;i++){
     if (alphabets[i].isErased == false){
         alphabets[i].checkHovered();
         if (alphabets[i].isHovered == true){
           if (alphabets[i].wasHovered == false){
             alphabets[i].c = brightercolor(alphabets[i].c ,60);
           }
         }else{
           if (alphabets[i].wasHovered == true){
             alphabets[i].c = brightercolor(alphabets[i].c ,-60);
           }
         }
     }else{
       alphabets[i].erase_block();
     }
   }  
   
   for(i=0;i<alphabets.length;i++){
     alphabets[i].draw()     
   }
   for (i=0;i<pavars.length;i++){
     if (isStartedDropping[i]){
       pavars[i].drop();
       pavars[i].draw();
     }
   }
   if (pavartimer>0){
     pavartimer--;
   }else{
     if (pavarcurindex == pavarcount){
       pavartimer = 0;
     }else{
       pavarcurindex++;
       isStartedDropping[pavarcurindex] =true;
       pavartimer = 15;
     }
   }
 }

function mousePressed(){
   for (var i=0;i<alphabets.length;i++){
     if (alphabets[i].isErased == false){
     if (alphabets[i].isHovered == true){
       alphabets[i].erase();
       pavarcount += pavarcountperclick;
       if(pavarcountperclick == 4){
         pavarcountperclick = 3;
       }
       break;
     }
   }
   }
 }
 
function brightercolor(c, offset){
   var r = c.levels[0];
   var g = c.levels[1];
   var b = c.levels[2];
   r += offset;
   g += offset;
   b += offset;
   return color(r,g,b);
   
 }

function makeFloatVelocity(offset){
   var floatingVelocity = new Array(120);
   var c;
   for (var i=0;i<floatingVelocity.length;i++){
       c = (i*3);
       floatingVelocity[i] = (offset*cos(radians(c))/3);
   }
   return floatingVelocity;
 }
 
 
function sumList(list, r){
  var result = 0;
  for (var i=0;i<r;i++){
     result += list[i];
   }
   return result;
 }
 
var backgroundblock = [[[1,1,1,0,0,0,0,0,0,0,1,0,0,0,0],
                               [1,1,1,0,0,0,0,0,0,0,1,0,0,0,0],
                               [1,1,1,0,0,0,0,0,0,0,1,0,0,0,0],
                               [1,1,1,0,0,0,0,0,0,0,1,0,0,0,0],
                               [1,1,1,0,0,1,0,0,0,0,1,0,0,0,0],
                               [1,1,1,0,0,1,1,0,0,0,1,0,0,0,0],
                               [1,1,1,0,0,1,1,1,0,0,1,0,0,0,0],
                               [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
                               [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
                               [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                               [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
                               
                              [[1,1,0,0,1,1,1,1,0,0,1,1,1],
                               [1,1,0,0,1,1,1,1,0,0,1,1,1],
                               [1,1,1,0,0,1,1,0,0,1,1,1,1],
                               [1,1,1,1,0,0,0,0,1,1,1,1,1],
                               [1,1,1,1,1,1,1,1,1,1,1,1,1],
                               [1,1,1,1,1,1,1,1,1,1,1,1,1],
                               [1,1,1,1,1,1,1,1,1,1,1,1,1],
                               [1,1,1,1,1,1,1,1,1,1,1,1,0],
                               [0,0,1,1,1,1,1,1,1,1,1,0,0],
                               [0,0,0,1,1,1,1,1,1,1,0,0,0],
                               [0,0,0,0,1,1,1,1,1,0,0,0,0]],
                               
                              [[0,0,0,0,1,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1],
                               [0,0,0,0,1,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0],
                               [0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0],
                               [0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0],
                               [0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0],
                               [0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0],
                               [0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0],
                               [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
                               [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
                               [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],  
                               [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]],
                               
                              [[0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                               [0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                               [0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                               [0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                               [0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                               [0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                               [0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                               [0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                               [0,1,1,1,1,1,1,1,1,1,1,1,1,1],
                               [1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
                               
 [[1,1,1,1,1,0,0,0,0,0,0,0],
   [1,1,1,1,1,1,1,0,0,0,0,0],
   [1,1,1,1,1,1,1,1,1,0,0,0],
   [1,1,1,1,1,1,1,1,1,1,1,1],
   [1,1,1,1,1,1,1,1,1,1,1,1],
   [1,1,1,1,1,1,1,1,1,1,1,1],
   [0,0,0,0,0,1,1,1,0,0,0,0],
   [0,0,0,0,0,0,1,1,0,0,0,0],
   [0,0,0,0,0,0,0,1,0,0,0,0]],
   
 [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0]],
  
 [[0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1]],
  
 [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]],
  
 [[1,0,0,1,1,0,0,0,0,0,0,0],
  [1,1,0,0,0,0,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0],
  [1,1,1,1,0,0,0,0,0,0,0,0]],
 
 [[0,0,0,0,0,1,1,1,1,0,0,1,1],
  [0,0,0,0,0,1,1,1,1,0,0,1,1],
  [0,0,0,0,0,1,1,1,1,0,0,1,1],
  [0,0,0,0,0,1,1,1,1,0,0,1,1],
  [0,0,0,0,0,1,1,1,1,0,0,1,1],
  [0,0,0,0,0,1,1,1,1,0,0,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,1,1,1],
  [0,0,0,0,0,0,1,1,1,1,1,1,1],
  [0,0,0,0,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1]],
 
 [[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0],
  [0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0],
  [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0]],
  
 [[1,0,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1],
  [1,1,1]],
  
 [[0,0,0,0,0,0,0,0,1,1,1,1],
  [0,0,0,0,1,1,1,0,0,1,1,1],
  [0,0,0,0,1,1,1,0,0,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,1,1],
  [0,0,0,0,1,1,1,0,0,1,1,1],
  [0,0,0,0,1,1,1,0,0,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,1,1],
  [0,0,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,0,0]],
  
 [[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  
 [[1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [1,1,1,1,1,1],
  [0,0,0,0,0,1],
  [0,0,0,0,0,1]],
  
 [[1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,1,1,1,0,0,0,0,0,0],
  [1,0,0,1,1,1,1,0,0,0,0,0],
  [1,0,0,1,1,1,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,1,1,0,0,0,0,0,0,0],
  [1,0,0,1,1,1,0,0,0,0,0,0],
  [1,0,0,1,1,1,0,0,0,0,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,0]],
 
 [[0,0,0,0,0,1,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1]],
 
 [[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]],
 
 [[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1]]];
                                
  
var alphabet_shape =[[[1,1,1,1,1,0,0],
                              [1,1,0,0,1,1,0],
                              [1,1,0,0,0,1,1],
                              [1,1,0,0,0,1,1],
                              [1,1,0,0,0,1,1],
                              [1,1,0,0,1,1,0],
                              [1,1,1,1,1,0,0]],
                              
                            [[1,1,1,1,1,1,1],
                            [1,1,0,0,0,0,0],
                            [1,1,0,0,0,0,0],
                            [1,1,1,1,1,1,0],
                            [1,1,0,0,0,0,0],
                            [1,1,0,0,0,0,0],
                            [1,1,1,1,1,1,1]],
                            [[0,1,1,1,1,0,0],[1,1,0,0,1,1,0],[1,1,0,0,0,0,0],[0,1,1,1,1,1,0],[0,0,0,0,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0]],
                            [[1,1,1,1,1,1],[0,0,1,1,0,0],[0,0,1,1,0,0],[0,0,1,1,0,0],[0,0,1,1,0,0],[0,0,1,1,0,0],[1,1,1,1,1,1]],
                            [[0,0,1,1,1,1,1],[0,1,1,0,0,0,0],[1,1,0,0,0,0,0],[1,1,0,0,1,1,1],[1,1,0,0,0,1,1],[0,1,1,0,0,1,1],[0,0,1,1,1,1,1]],
                            [[1,1,0,0,0,1,1],[1,1,1,0,0,1,1],[1,1,1,1,0,1,1],[1,1,1,1,1,1,1],[1,1,0,1,1,1,1],[1,1,0,0,1,1,1],[1,1,0,0,0,1,1]]];
 
                                
