document.addEventListener('DOMContentLoaded', () => {
  //const h1 = document.querySelector('h1')
  const width = 20
  const grid = document.querySelector('.grid')
  const alien = 11
  const alienRow = 5
  let playerIndex, previousIndex, timerId, div, gameTimerId,  move = 'left'
  let bullet = 0
  let changeDirection = false
  let goDown = false


  //used to store the alien object and can be used in a global aspect
  let arr = []
  //- Scoring and Lives
  //3 Lives - Player
  //10 points - last row
  //20 points - 3rd and 4rth row
  //30 points - 1st and 2nd row
  //50, 100, 300 or 500 points - Mystery ship
  //class


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
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 39 && playerIndex<(div.length-1)){
      playerIndex++
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 32){
      //restrice users from spamming space to shoot all the time
      if(!bullet){
        shoot(playerIndex, 'shooting')
      }
    }
  }

  //ADD AND REMOVE PLAYER DIRECTION
  function movePlayer(playerIndex, previousIndex){
    div[previousIndex].classList.remove('player')
    div[playerIndex].classList.add('player')
  }

  //CREATES A BULLET OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex,classname){
    bullet = playerIndex
    timerId = setInterval(()=> {
      bullet-=20
      if(bullet<0){
        clearInterval(timerId)
        div[bullet+width].classList.remove(classname)
        bullet = undefined
      }else{
        div[bullet+width].classList.remove(classname)
        div[bullet].classList.add(classname)
      }
      checkHit(bullet, classname)
    }, 80)
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
  function checkHit(playerShootindx, className){
    arr.forEach(elem =>{
      if(!!elem && elem === playerShootindx){
        clearInterval(timerId)
        div[playerShootindx].classList.remove(className)
        div[playerShootindx].classList.remove('alien')
        bullet = undefined
      }
    })
    arr = arr.filter(elem => elem !== playerShootindx)
  }

  function alienCreate(index){
    let startPosition = index
    let endPosiition = startPosition+alien
    //alien*alienRow
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
        console.log('down')
      }
    })
    displayAlienmove()
  }

  function checkAlien(){
    arr.forEach((elem, index)=>{
      if((arr[index]+1)%width === 0 || arr[index]%width === 0){
        changeDirection = true
      }else if(arr[index]+1 > div.length-width){
        endGame()
      }
    })
  }

  function endGame(){
    clearInterval(gameTimerId)
  }

  // start the timer
  function startTimer(delay){
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
    alienCreate(20)
    div[playerIndex].classList.add('player')
    startTimer(150)
  }

  init()
})
