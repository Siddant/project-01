document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('h1')
  const width = 20
  const grid = document.querySelector('.grid')
  const userScore = document.querySelector('#score')
  const userLevel = document.querySelector('#level')
  const alien = 11, alienRow = 5
  let playerIndex, timerId, shootingIndex, div, score = 0,
    laser, gameTimerId, move = 'right', changePosition =false,
    level = 1, delay = 500
  //used to store the alien object and can be used in a global aspect
  let arr = []
  //- Scoring and Lives
  //3 Lives - Player
  //10 points - last row
  //20 points - 3rd and 4rth row
  //30 points - 1st and 2nd row
  //50, 100, 300 or 500 points - Mystery ship

  //class
  class Shooting {
    constructor(playeIndex, width, timerId,shooter, cssClass) {
      this.shootingIndex = playeIndex
      this.width  =  width
      this.timerId = timerId
      this.shooter = shooter
      this.class = cssClass
    }
    get shottingIndex() {
      return this.shootingIndex
    }
    get previousShootingIndex(){
      return this.shootingIndex + this.width
    }
    set shootingTimerId(minus) {
      this.timerId = minus
    }
    get shootingTimerId() {
      return this.timerId
    }
    moveUp(){
      this.shootingIndex -= this.width
    }
    moveDown(){
      this.shootingIndex += this.width
    }
  }

  class Alien{
    constructor(alienIndex, points) {
      this.alienIndex = alienIndex
      this.points = points
      this.width = 20
    }
    moveDown(){
      this.alienIndex += this.width
    }
    moveLeft(){
      this.alienIndex -= 1
    }
    moveRight(){
      this.alienIndex += 1
    }
  }

  //CREATE DIVS AND ADD DIVS
  function addElement() {
    const newDiv = document.createElement('div')
    grid.appendChild(newDiv)
  }

  //HANDLE PLAYER EVENTS
  function handleKeydown(e){
    const previousIndex = playerIndex
    if(e.keyCode === 37 && playerIndex>(div.length-width)){
      playerIndex--
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 39 && playerIndex<(div.length-1)){
      playerIndex++
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 32){
      //restrice users from spamming space to shoot all the time
      if(!laser){
        shoot(playerIndex, 'user')
      }
    } else{
      shoot(25, 'alien')
    }
  }

  //ADD AND REMOVE PLAYER DIRECTION
  function movePlayer(playerIndex, previousIndex){
    div[previousIndex].classList.remove('player')
    div[playerIndex].classList.add('player')
  }

  //moves the laser
  function movelaser(){
    //console.log(laser.shooter)
    const previousShoot = laser.shottingIndex
    if(laser.shooter === 'user')laser.moveUp()
    else laser.moveDown()
    if(laser.shottingIndex<0 || laser.shottingIndex>=(div.length-width)){
      clearInterval(laser.shootingTimerId)
      div[previousShoot].classList.remove(laser.class)
      laser = undefined
    }else{
      div[previousShoot].classList.remove(laser.class)
      div[laser.shottingIndex].classList.add(laser.class)
    }
    if(laser)checkHit(laser.shottingIndex, laser.class, laser.shootingTimerId)
  }

  //CREATES A laser OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex, shooter){
    shootingIndex = playerIndex
    laser = new Shooting(shootingIndex,width,0,shooter, 'shooting')
    timerId = setInterval(movelaser, 30)
    if(laser.shootingTimerId===0)laser.shootingTimerId = timerId
  }

  //CREATE THE ALIEN OBJECT USING THE ALIEN CLASS
  function alienCreate(index, className){
    let points = 30
    for(let i = 0; i<alien*alienRow; i++) {
      const aliens = new Alien(index , points)
      div[aliens.alienIndex].classList.add(className)
      arr.push(aliens)
      index++
      if((i+1) % alien ===0)index = (index+width)-(alien)
      if((i+1)%(alien*Math.floor(alienRow/2))===0)points -= 10
    }
  }

  //function to check weahther to end the game
  function checkEnd(){
    if(arr.length === 0 ){
      //endGame()
      //laser = undefined
      clearInterval(gameTimerId)
      if(level<=7)delay -= 50
      level++
      console.log(delay)
      document.addEventListener('keydown', handleKeydown)
      startGame()
    }else{
      arr.forEach((elem)=>{
        if(elem.alienIndex+1 > div.length-(width*2)){
          endGame()
          h1.innerText = 'Game Over'
          delay = 500
        }
      })
    }
  }

  //ENDS THE GAME
  function endGame(){
    clearInterval(gameTimerId)
    clearInterval(timerId)
    document.removeEventListener('keydown', handleKeydown)     // Fails
  }

  //move the alien
  //move the alien index
  function moveAlien(move){
    arr.forEach(elem=>{
      if(move === 'left'){
        elem.moveLeft()
      }else if(move=== 'right'){
        elem.moveRight()
      }  else{
        elem.moveDown()
      }
    })
    displayAlienmove()
  }

  function checkAlienindex(){
    arr.forEach(elem=>{
      if((elem.alienIndex+1)%width === 0 || elem.alienIndex%width === 0){
        changePosition = true
      }
    })
  }

  //paints the alien
  function displayAlienmove(){
    //removes the aliens
    div.forEach(divs => {
      if(divs.classList.value === 'alien'){
        divs.classList.remove('alien')
      }
    })
    //repaints the aliens
    arr.forEach(alien => {
      div[alien.alienIndex].classList.add('alien')
    })
  }

  //collision dection  to check if the users hit the alien
  function checkHit(laserindx, className, timerId){
    arr.forEach(elem =>{
      if(!!elem.alienIndex && elem.alienIndex === laserindx && laser.shooter === 'user'){
        clearInterval(timerId)
        div[laserindx].classList.remove(className)
        div[laserindx].classList.remove('alien')
        score += elem.points
        arr = arr.filter(elem => elem.alienIndex !== laserindx)
        elem = undefined
        laser = undefined
        userScore.innerText = score
      }
    })
  }

  // start the timer
  function startTimer(){
    gameTimerId = setInterval(()=> {
      if(changePosition){
        moveAlien('down')
        if(move ==='left'){
          move ='right'
        }else{
          move ='left'
        }
        changePosition = false
      }else{
        moveAlien(move)
        checkAlienindex()
      }
      checkEnd()
    }, delay)
  }

  function startGame(){
    userLevel.innerText = level
    alienCreate(23,'alien')
    div[playerIndex].classList.add('player')
    startTimer()
  }

  //INITIALIZE THE GAME
  function init(){
    for(let i = 0; i<width*width; i++) {
      addElement()
    }
    div = document.querySelectorAll('.grid div')
    //caluclate the player position, which is the center of the bottom of the screen
    playerIndex = (div.length-1)-Math.floor(width/2)
    document.addEventListener('keydown', handleKeydown)
    startGame()
  }

  init()
})
