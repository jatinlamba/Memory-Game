// Data to render on cards when card flips.
const data = [  
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/3.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/3.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/3.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/3.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/4.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/4.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/2.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/2.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/4.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/4.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/1.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/1.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/1.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/1.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/2.JPG" />`,
  `<img class="img-fluid card-img" src="https://s3.us-east-2.amazonaws.com/img-game/2.JPG" />`
];
let opened = []; // Opened cards indexes.
let temp2Opened = []; // temporary 2 opened cards indexes.
let numberOfSteps = 0; // No of clicks on the cards.
let timer;
let currentTime = "0 : 00"; // Formatted running time to show on screen.
let elapsed = 0; // Elapsed time in ms.

let svgStar =  0;

/**
 * @description Shuffles cards randomly
 * @param {Array} cardsList
 * @returns {Array} Shuffled array
 */
const shuffleCards = cardsList => {
  return [...cardsList].sort(() => {
    return 0.5 - Math.random();
  });
};

/**
 * @description Calculate star ratings according to time and number of moves.
 * @param {number} time
 * @param {number} moves
 * @returns {string} Star rating
 */
 const calculateStarRatings = (time, moves) => {
 const timeInSeconds = time / 1000;
  if (timeInSeconds < 55 && moves > 7) {
    return svgStar = 1500;
  } else if (timeInSeconds < 85 && moves > 3) {
    return svgStar = 1000;
  } else if (timeInSeconds < 105 && moves > 1) {
    return svgStar = 500;
  } else {
    return svgStar = 0;
  }
};

/**
 * @description Register click events on particular cards.
 * @param {number} index
 * @param {Array} cards
 */
const registerClickEvent = (index, cards) => {
  const mainCard = $("#ele-" + index);
  // Register click events on the cards.
  mainCard.click(() => {
    // Change score on every flip of the card.
    mainCard.addClass("board-flip");
    $("#star-ratings").html(calculateStarRatings(elapsed, numberOfSteps));

    // Using setTimeouts for animation purposes.
    setTimeout(() => {
      $("#ele-" + index + "-inner").css("visibility", "visible");
    }, 100);
    
    // append index of card values.
    temp2Opened.push(index);
    opened.push(index);
    mainCard.unbind("click");
    
    if (temp2Opened.length === 2) {
      // Increase number of steps whenever user clicks a card.
      numberOfSteps++;
      $("#no-of-steps").text(numberOfSteps);

      // If 2 successive cards clicked are same push there index in opened array.
      if (cards[temp2Opened[0]] === cards[temp2Opened[1]]) {
        opened = _.uniq([...opened, ...temp2Opened]);
        
      } else {
        // Animation stuff
        const temp2OpenedCopy = [...temp2Opened];
        setTimeout(() => {
          $("#ele-" + temp2OpenedCopy[0]).removeClass("board-flip");
          $("#ele-" + temp2OpenedCopy[1]).removeClass("board-flip");
        }, 400); 
          
        // bind click event back.
        mainCard.bind({
          click: registerClickEvent(temp2Opened[0], cards)
        });
        mainCard.bind({
          click: registerClickEvent(temp2Opened[1], cards)
        });

        // Remove them from opened array.
        _.remove(opened, o => o === temp2Opened[0] || o === temp2Opened[1]);
        showRejectionPopUp();
        $('#progress').hide('svg circle');
      }
      temp2Opened = [];
    }

    // Only keep open those cards which matched successfully else make them hidden.
    cards.forEach((element, index) => {
      if (!opened.includes(index)) {
        setTimeout(() => {
          $("#ele-" + index + "-inner").css("visibility", "hidden");
        }, 500);
        _.remove(opened, o => o === index);
         
      }
    });

    // If all the cards are opened show congratulation pop up.
    if (opened.length === data.length) {
      showCongratulationPopUp();
      $('#progress').hide('svg circle');
    }
  });
};

/**
 * @description Reset board to initial state.
 */
const resetBoard = () => {  
  const shuffledCards = shuffleCards(data);  
  shuffledCards.forEach((element, index) => {
    // Append cards to the game board.
    $("#game-board").append(
      `<div id="ele-${index}" class="board element">
          <div id="ele-${index}-inner">${element}</div>
      </div>`
    );
    // Set visibility hidden for the card values after 10 seconds.
    if (!opened.includes(index)) {
        setTimeout(() => {
    $("#ele-" + index + "-inner").css("visibility", "hidden");
      }, 30000);
    _.remove(opened, o => o === index);
      }
   
    // Click events on cards.
    registerClickEvent(index, shuffledCards);

  });
};

/**
 * @description Game timer for tracking time.
 */
const gameTimer = () => {
  let startTime = new Date().getTime();

  timer = setInterval(() => {
    let now = new Date().getTime();

    elapsed = now - startTime;
    let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    currentTime = minutes + " : " + seconds;

    $("#clock").text(currentTime);
  }, 1000);
};

/**
 * @description Removes game board from screen.
 */
const removeGameBoardFromScreen = () => {
  $("#game-board").empty();
};

/**
 * @description Resets number of steps to 0 and render on screen.
 */
const resetNumberOfSteps = () => {
  numberOfSteps = 0;
  $("#no-of-steps").text(numberOfSteps);
};

/**
 * @description Resets timer to start again form 0 and render on the screen.
 */
const resetTimer = () => {
  clearInterval(timer);
  $("#clock").text("0 : 00");
};

const resetProgress = () => {
$('#progress').show('svg circle');
}

/**
 * @description Reset game to the initial state.
 */
const resetGame = () => {
  removeGameBoardFromScreen();
  resetBoard();
  resetNumberOfSteps();
  resetTimer();
  gameTimer();
  opened = [];
  temp2Opened = [];
  $("#star-ratings").html(svgStar = 0);  
  resetProgress();
};

// Shows a modal with congratulations when a user wins the game.
const showCongratulationPopUp = () => {
  $("#game-modal").modal("show");
  $(".modal-content")
    .html(`<div style="background-color: white;"> 
    <img src="https://s3.us-east-2.amazonaws.com/img-game/Capture2.JPG">
      <font face="verdana" color="#0E37BF"><b> &emsp; Congratulations! You have won the game!!!</font></b><br> 
    <!--  You have taken: ${currentTime}. &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; -->
    &emsp; <font size="5" color="#0E37BF"><b>Score: ${calculateStarRatings(elapsed, numberOfSteps)}</b></font> &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;    
   <font size="5" color="#0E37BF"><b>Share:
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <a href="https://www.gmail.com" class="fa fa-google"></a>
      <a href="http://www.facebook.com" class="fa fa-facebook"></a>
      <a href="https://www.twitter.com" class="fa fa-twitter"></a> </b></font>  
<font face="verdana" color="#0E37BF"><b> &emsp; Do you want to play again?</font></b> <button class="btn btn-danger restart-game">Restart Game</button>    
</div>`);
  $(".restart-game").click(() => {
  resetGame();  
  $("#game-modal").modal("hide");
});
};

// Shows a modal with rejection when a user wins the game.
const showRejectionPopUp = () => {
  $("#game-modal").modal("show");
  $(".modal-content")
    .html(`<div style="background-color: white;"> 
    <img src="https://s3.us-east-2.amazonaws.com/img-game/Capture2.JPG">
      <font face="verdana" color="#0E37BF"><b> &emsp; Sorry! You have lost the game!!!</font></b> <br>
  <!--    You have taken: ${currentTime}. &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; -->
      &emsp; <font size="5" color="#0E37BF"><b>Score: ${calculateStarRatings(elapsed, numberOfSteps)}</b></font> &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;   
   <font size="5" color="#0E37BF"><b>Share:
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <a href="https://www.gmail.com" class="fa fa-google"></a>
      <a href="http://www.facebook.com" class="fa fa-facebook"></a>
      <a href="https://www.twitter.com" class="fa fa-twitter"></a> </b></font>  
<font face="verdana" color="#0E37BF"><b> &emsp; Do you want to play again?</font></b> <button class="btn btn-danger restart-game">Restart Game</button> 
</div>`);
  $(".restart-game").click(() => {
  resetGame(); 
  $("#game-modal").modal("hide");
});
};

// Show start game modal on the first load.
  $("#game-modal").modal("show");
  $(".restart-game").click(() => {
  resetGame(); 
  $("#game-modal").modal("hide");
});