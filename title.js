var titleScreen = document.getElementById ("title-screen");
var gameScreen = document.getElementById("game-screen");
var playButton = document.getElementById("play");
document.getElementById("play").addEventListener("click",function(){
    document.getElementById("title-screen").style.display ="none";
    document.getElementById("game-screen").style.display ="block";

});

playButton.addEventListener("click", function(event){
    event.preventDefault();
    titleScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    startNewOrder();
});

// example list of your assets
const broths = {
  spicy: "",
  mild: "",
  curry:"",
  nonSpicy:"",
};

const ingredients = {
  lettuce: "images/4lettuce.PNG",
  corn: "images/3corn.PNG",
  beef: "images/2beef.PNG",
  mushroom: "images/5mushroom.PNG",
  fish: "images/1fish.PNG",
  juice: "images/11juice.PNG",
  soda: "images/12soda.PNG"
};

// choose random broth
function generateOrder() {
  const brothKeys = Object.keys(broths);
  const randomBroth = brothKeys[Math.floor(Math.random() * brothKeys.length)];

  // set broth image
  document.getElementById("order-broth-img").src = broths[randomBroth];

  // choose 3 ingredients randomly
  const ingredientKeys = Object.keys(ingredients);
  shuffle(ingredientKeys);
  const chosen = ingredientKeys.slice(0, 3);

  const list = document.getElementById("order-ingredients");
  list.innerHTML = "";

  chosen.forEach(item => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = ingredients[item];
    img.alt = item;
    li.appendChild(img);
    list.appendChild(li);
  });
}

// simple shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

generateOrder();


// All possible game items (use your real file names)
const itemDefs = [
  { id: "broth_spicy",  type: "broth",      name: "Spicy Broth",  img: "images/broth_spicy.png" },
  { id: "broth_mild",   type: "broth",      name: "Mild Broth",   img: "images/broth_mild.png" },
  { id: "curry",   type: "broth",      name: "Mild Broth",   img: "images/broth_mild.png" },
  { id: "nonSpicy",   type: "broth",      name: "Mild Broth",   img: "images/broth_mild.png" },


  { id: "corn",         type: "ingredient", name: "Corn",         img: "images/3corn.PNG" },
  { id: "lettuce",      type: "ingredient", name: "Lettuce",      img: "images/4lettuce.PNG" },
  { id: "mushroom",     type: "ingredient", name: "Mushroom",     img: "images/5mushroom.PNG" },
  { id: "fish",     type: "ingredient", name: "Fish",    img: "images/1fish.PNG" },
  { id: "beef",     type: "ingredient", name: "Beef",    img: "images/2beef.PNG" },
  { id: "juice",         type: "ingredient", name: "Juice",         img: "images/11juice.PNG" },
  { id: "soda",      type: "ingredient", name: "Soda",      img: "images/12soda.PNG" }
  
];

// DOM refs
const orderBrothImg        = document.getElementById("order-broth-img");
const orderIngredientsList = document.getElementById("order-ingredients");
const orderStatus          = document.getElementById("order-status");
const pantryContainer      = document.getElementById("pantry-items");
const potItemsContainer    = document.getElementById("pot-items");

// Current order + what player clicked
let currentOrder = { brothId: null, ingredientIds: [] };
let clickedItemIds = [];


function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function startNewOrder() {
  const broths      = itemDefs.filter(it => it.type === "broth");
  const ingredients = itemDefs.filter(it => it.type === "ingredient");

  const randomBroth = broths[Math.floor(Math.random() * broths.length)];

  shuffle(ingredients);
  const chosenIngredients = ingredients.slice(0, 3);   // 3 ingredients

  currentOrder.brothId       = randomBroth.id;
  currentOrder.ingredientIds = chosenIngredients.map(it => it.id);

  clickedItemIds = [];
  potItemsContainer.innerHTML = "";
  orderStatus.textContent = "Click the correct broth and ingredients to add them to the pot.";

  // show order images
  orderBrothImg.src = randomBroth.img;
  orderBrothImg.alt = randomBroth.name;

  orderIngredientsList.innerHTML = "";
  chosenIngredients.forEach(it => {
    const li  = document.createElement("li");
    const img = document.createElement("img");
    img.src = it.img;
    img.alt = it.name;
    li.appendChild(img);
    orderIngredientsList.appendChild(li);
  });

  buildPantry();
}


function buildPantry() {
  pantryContainer.innerHTML = "";

  itemDefs.forEach(it => {
    const img = document.createElement("img");
    img.src = it.img;
    img.alt = it.name;
    img.className = "pantry-item";
    img.dataset.itemId = it.id;

    img.addEventListener("click", onPantryClick);

    pantryContainer.appendChild(img);
  });
}



function onPantryClick(e) {
  const itemId = e.target.dataset.itemId;
  if (!itemId) return;

  // avoid duplicates
  if (clickedItemIds.includes(itemId)) return;
  clickedItemIds.push(itemId);

  // add to pot visually
  const def = itemDefs.find(it => it.id === itemId);
  if (!def) return;

  const img = document.createElement("img");
  img.src = def.img;
  img.alt = def.name;
  potItemsContainer.appendChild(img);

  checkOrderComplete();
}

function checkOrderComplete() {
  const hasBroth = clickedItemIds.includes(currentOrder.brothId);
  const allIngredients = currentOrder.ingredientIds.every(id =>
    clickedItemIds.includes(id)
  );

  const requiredSet = [currentOrder.brothId, ...currentOrder.ingredientIds];
  const hasExtra = clickedItemIds.some(id => !requiredSet.includes(id));

  if (hasBroth && allIngredients && !hasExtra) {
    orderStatus.textContent = "Perfect!";
    // Start a new order after a short pause
    setTimeout(startNewOrder, 1500);

  } else {
    orderStatus.textContent = "Not quite...";
  }
}
