document.addEventListener('DOMContentLoaded', () => {
  const width = 20, grid = document.querySelector('.grid'), alien = 11,
    alienRow = 5, delay = 100
  let playerIndex, previousIndex, timerId, div, gameTimerId, move = 'right',
    bullet = 0, changeDirection = false, gameEnd = false, arr = []
  //- Scoring and Lives
  //3 Lives - Player
  //10 points - last row
  //20 points - 3rd and 4rth row
  //30 points - 1st and 2nd row
  //50, 100, 300 or 500 points - Mystery ship
  //CREATE DIVS AND ADD DIVS
  function addElement() {
    const newDiv = document.createElement('div')
    grid.appendChild(newDiv)
  }

  //HANDLE PLAYER EVENTS
  function handleKeydown(e){
    previousIndex = playerIndex
    if(e.keyCode === 37 && playerIndex>(div.length-width)){
      playerIndex--
    }else if (e.keyCode === 39 && playerIndex<(div.length-1)){
      playerIndex++
    }else if (e.keyCode === 32){
      //restrice users from spamming space to shoot all the time
      if(!bullet && !gameEnd){
        shoot(playerIndex)
      }

    }
    movePlayer(playerIndex, previousIndex)
  }

  //ADD AND REMOVE PLAYER DIRECTION
  function movePlayer(playerIndex, previousIndex){
    div[previousIndex].classList.remove('player')
    div[playerIndex].classList.add('player')
  }

  //CREATES A BULLET OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex){
    bullet = playerIndex
    timerId = setInterval(()=> {
      bullet-=20
      if(bullet<0){
        clearInterval(timerId)
        div[bullet+width].classList.remove('shooting')
        bullet = undefined
      }else{
        div[bullet].classList.add('shooting')
        div[bullet+width].classList.remove('shooting')
      }
      checkHit(bullet)
    }, 60)
  }

  //paints the alien
  function displayAlienmove(){
    //reomves the aliens
    div.forEach(divs => {
      if(divs.classList.value === 'alien'){
        divs.classList.remove('alien')
      }
    })
    //repaints the aliens
    arr.forEach(alien => {
      div[alien].classList.add('alien')
    })
  }

  //collision dection  to check if the users hit the alien
  function checkHit(playerShootindx){
    arr.forEach(elem =>{
      if(!!elem && elem === playerShootindx){
        clearInterval(timerId)
        div[playerShootindx].classList.remove('shooting')
        div[playerShootindx].classList.remove('alien')
        bullet = undefined
        arr = arr.filter(elem => elem !== playerShootindx)
      }
    })
  }

  function alienCreate(index){
    let startPosition = index
    let endPosiition = startPosition+alien
    for(let i = 0; i<alien*alienRow; i++) {
      if(startPosition === endPosiition){
        endPosiition+=width
        startPosition= (startPosition-10)+20
      }else{
        startPosition++
      }
      div[startPosition].classList.add('alien')
      arr.push(startPosition)
    }
  }

  function moveAlien(move){
    arr.forEach((elem, index)=>{
      if(move === 'left'){
        arr[index] -= 1
      }else if(move === 'right'){
        arr[index] += 1
      }else{
        arr[index] += 20
      }
    })
    displayAlienmove()
  }

  function checkAlien(){
    arr.forEach((elem, index)=>{
      if((arr[index]+1)%width === 0 || arr[index]%width === 0){
        changeDirection = true
      }else if(arr[index]+1 >= div.length-(width*2)){
        gameEnd =true
        endGame()
      }
    })
  }

  function endGame(){
    clearInterval(gameTimerId)
    clearInterval(timerId)
  }

  // start the timer
  function startTimer(){
    gameTimerId = setInterval(()=> {
      if(changeDirection){
        moveAlien('down')
        if(move ==='left'){
          move ='right'
        }else{
          move ='left'
        }
        changeDirection = false
      }else{
        moveAlien(move)
        checkAlien()
      }
    }, delay)
  }

  //INITIALIZE THE GAME
  function init(){
    for(let i = 0; i<width*width; i++) {
      addElement()
    }
    div = document.querySelectorAll('.grid div')
    document.addEventListener('keydown', handleKeydown)
    //caluclate the player position, which is the center of the bottom of the screen
    playerIndex = (div.length-1)-(width/2)
    alienCreate(23)
    div[playerIndex].classList.add('player')
    startTimer()
  }

  init()
})
