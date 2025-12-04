window.addEventListener("DOMContentLoaded", () => {

  const titleScreen   = document.getElementById("title-screen");
  const gameScreen    = document.getElementById("game-screen");
  const playButton    = document.getElementById("play");

  const orderBrothImg        = document.getElementById("order-broth-img");
  const orderIngredientsList = document.getElementById("order-ingredients");
  const orderStatus          = document.getElementById("order-status");
  const potItemsContainer    = document.getElementById("pot-items");
  const customerImgEl        = document.getElementById("customer-img");

  const scoreEl      = document.getElementById("score");
  const timeLeftEl   = document.getElementById("time-left");
  const endScreen    = document.getElementById("end-screen");
  const finalScoreEl = document.getElementById("final-score-text");
  const restartBtn   = document.getElementById("restart-btn");


  const itemDefs = [

    { id: "broth_spicy",  type: "broth",      name: "Spicy Broth",  img: "images/spicy.png" },
    { id: "broth_mild",   type: "broth",      name: "Mild Broth",   img: "images/tomato.png" },
    { id: "broth_curry",  type: "broth",      name: "Curry Broth",  img: "images/curry.png" },
    { id: "broth_plain",  type: "broth",      name: "Non-Spicy",    img: "images/nonSpicy.png" },


    { id: "corn",     type: "ingredient", name: "Corn",     img: "images/3corn.PNG" },
    { id: "lettuce",  type: "ingredient", name: "Lettuce",  img: "images/4lettuce.PNG" },
    { id: "mushroom", type: "ingredient", name: "Mushroom", img: "images/5mushroom.PNG" },
    { id: "fish",     type: "ingredient", name: "Fish",     img: "images/1fish.PNG" },
    { id: "beef",     type: "ingredient", name: "Beef",     img: "images/2beef.PNG" },
    { id: "juice",    type: "ingredient", name: "Juice",    img: "images/11juice.PNG" },
    { id: "soda",     type: "ingredient", name: "Soda",     img: "images/12soda.PNG" }
  ];

  const customers = [
    { id: "panda1", img: "images/panda1.png" },
    { id: "panda2", img: "images/panda2.png" },
    { id: "panda3", img: "images/panda3.png" }
  ];

  const fixedAssets = [
    { id: "fish",        img: "images/1fish.PNG",        x: "85%", y: "57%" },
    { id: "cutFish",     img: "images/1fishcut.PNG",     x: "76%", y: "57%" },
    { id: "beef",        img: "images/2beef.PNG",        x: "67%", y: "57%" },
    { id: "cutBeef",     img: "images/2beefcut.PNG",     x: "58%", y: "57%" },
    { id: "corn",        img: "images/3corn.PNG",        x: "49%", y: "57%" },
    { id: "cutCorn",     img: "images/3corncut.PNG",     x: "41%", y: "58%" },
    { id: "lettuce",     img: "images/4lettuce.PNG",     x: "83%", y: "43%" },
    { id: "cutLettuce",  img: "images/4lettucecut.PNG", x: "74%", y: "43%" },
    { id: "mushroom",    img: "images/5mushroom.PNG",    x: "66%", y: "43%" },
    { id: "cutMushroom", img: "images/5mushroomcut.PNG", x: "57%", y: "43%" },
    { id: "juice",       img: "images/11juice.PNG",      x: "49%", y: "43%" },
    { id: "soda",        img: "images/12soda.PNG",       x: "41%", y: "43%" },
    { id: "broth_spicy", img: "images/spicy.png",        x: "31%", y: "80%" },
    { id: "broth_mild",  img: "images/tomato.png",       x: "65%", y: "80%" },
    { id: "broth_curry", img: "images/curry.png",        x: "17%", y: "80%" },
    { id: "broth_plain", img: "images/nonSpicy.png",     x: "81%", y: "80%" }
  ];


  let currentOrder   = { brothId: null, ingredientIds: [] };
  let clickedItemIds = [];
  let score          = 0;
  let timeLeft       = 60;
  let timerId        = null;
  let assetsLoaded   = false;


  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j   = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i]    = arr[j];
      arr[j]    = tmp;
    }
  }

  function addScore(points) {
    score += points;
    if (score < 0) score = 0;
    scoreEl.textContent = score;
  }

  function startGameTimer() {
    timeLeft = 60;
    timeLeftEl.textContent = timeLeft;

    if (timerId) clearInterval(timerId);

    timerId = setInterval(() => {
      timeLeft--;
      timeLeftEl.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timerId);
        timerId = null;
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    console.log("endGame called, score =", score);


    gameScreen.style.display = "none";


    finalScoreEl.textContent = score;

    endScreen.style.display = "flex";
  }


  function startNewOrder() {
    const brothPool      = itemDefs.filter(it => it.type === "broth");
    const ingredientPool = itemDefs.filter(it => it.type === "ingredient");

    const randomBroth = brothPool[Math.floor(Math.random() * brothPool.length)];

    shuffle(ingredientPool);
    const chosenIngredients = ingredientPool.slice(0, 3);

    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    customerImgEl.src = randomCustomer.img;
    customerImgEl.alt = randomCustomer.id;

    currentOrder.brothId       = randomBroth.id;
    currentOrder.ingredientIds = chosenIngredients.map(it => it.id);

    clickedItemIds = [];
    potItemsContainer.innerHTML = "";

    orderStatus.textContent = "Click the correct broth and ingredients.";
    orderStatus.classList.remove("status-perfect", "status-wrong");

    orderBrothImg.src = randomBroth.img;
    orderBrothImg.alt = randomBroth.name;

    orderIngredientsList.innerHTML = "";
    chosenIngredients.forEach(it => {
      const li  = document.createElement("li");
      const img = document.createElement("img");
      img.src   = it.img;
      img.alt   = it.name;
      li.appendChild(img);
      orderIngredientsList.appendChild(li);
    });
  }


  function addItemToPot(itemId) {
    if (clickedItemIds.includes(itemId)) return;

    const def = itemDefs.find(it => it.id === itemId);
    if (!def) return;

    const img = document.createElement("img");
    img.src   = def.img;
    img.alt   = def.name;
    potItemsContainer.appendChild(img);

    clickedItemIds.push(itemId);
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
      orderStatus.classList.remove("status-wrong");
      orderStatus.classList.add("status-perfect");

      addScore(100);
      setTimeout(startNewOrder, 1500);
    } else {
      orderStatus.textContent = "Not quite...";
      orderStatus.classList.remove("status-perfect");
      orderStatus.classList.add("status-wrong");
    }
  }


  function loadFixedAssets() {
    if (assetsLoaded) return;
    assetsLoaded = true;

    fixedAssets.forEach(a => {
      const img = document.createElement("img");
      img.src   = a.img;
      img.classList.add("asset");
      img.style.top  = a.y;
      img.style.left = a.x;

      img.addEventListener("click", () => {
        addItemToPot(a.id);
      });

      gameScreen.appendChild(img);
    });
  }

  playButton.addEventListener("click", event => {
    event.preventDefault();


    titleScreen.style.display = "flex";
    endScreen.style.display   = "none";
    titleScreen.style.display = "none";
    gameScreen.style.display  = "block";


    score = 0;
    scoreEl.textContent = score;

    timeLeft = 60;
    timeLeftEl.textContent = timeLeft;


    loadFixedAssets();
    startNewOrder();
    startGameTimer();
  });

  restartBtn.addEventListener("click", () => {
    endScreen.style.display   = "none";
    titleScreen.style.display = "flex";
  });
});
