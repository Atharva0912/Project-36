var dog, sadDog, happyDog;

var foodS, foodStock;
var fedTime, lastFed, currentTime;
var feed, addFood;

var gameState;
var changeState, readState;

var garden, washroom, bedroom;

var foodObj;

var database;

function preload() {
    sadDog = loadImage("Images/Dog.png");
    happyDog = loadImage("Images/happy dog.png");
}

function setup() {
    createCanvas(1100, 500);

    database = firebase.database();
    
    foodObj = new Food();
    
    foodStock = database.ref('Food');
    foodStock.on("value", readStock);
    
    fedTime = database.ref('FeedTime');
    fedTime.on("value", function(data) {
        lastFed = data.val();
    });
    
    readState = database.ref('GameState');
    readState.on("value", function(data) {
        gameState = data.val();
    });

    dog = createSprite(700, 250, 150, 150);
    dog.addImage(sadDog);
    dog.scale = 0.25;

    feed = createButton("Feed the dog");
    feed.position(700, 95);
    feed.mousePressed(feedDog);

    addFood = createButton("Add Food");
    addFood.position(800, 95);
    addFood.mousePressed(addFoods);
}

function draw() {
  background("green");
    currentTime = hour();

    if(currentTime == (lastFed + 1)) {
        update("Playing");
        foodObj.garden();
    }
    else if(currentTime == (lastFed + 2)) {
        update("Sleeping");
        foodObj.bedroom();
    }
    else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
        update("Bathing");
        foodObj.washroom();
    }
    else {
        update("Hungry");
        foodObj.display();
    }
    
    if(gameState != "Hungry") {
        feed.hide();
        addFood.hide();
        dog.remove();
    }
    else {
        feed.show();
        addFood.show();
        dog.addImage(sadDog);
    }
    
    drawSprites();
    
    textFont("Bob");
    textSize(20);
    textAlign(CENTER);
    fill("white");
    text("Food Stock: " + foodS, 900, 30);
}

function readStock(data) {
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
}

function feedDog() {
  if(gameState != "Happy"){  
  dog.addImage(happyDog);
  }
    
    foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
    database.ref('/').update({
        Food: foodObj.getFoodStock(),
        FeedTime: hour(),
        GameState: "Hungry"
    })
}

function addFoods() {
    foodS ++;
    database.ref('/').update({
        Food: foodS
    })
}

function update(state) {
    database.ref('/').update({
        GameState: state
    })
}
