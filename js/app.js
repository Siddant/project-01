document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('h1')
  const width = 20, motherShipPoint = [50, 100, 300, 500]
  const grid = document.querySelector('.grid')
  const userScore = document.querySelector('#score')
  const userLevel = document.querySelector('#level')
  const highScoreArray = JSON.parse(localStorage.getItem('HighScore')) || []
  const alien = 11, alienRow = 5
  let playerIndex, timerId, shootingIndex, div, score = 0,
    laser, gameTimerId, move = 'right', changePosition =false,
    level = 1,  delay = 500 //, motherShip
  //used to store the alien object and can be used in a global aspect
  let alienArray = []
  //let name
  //- Scoring and Lives
  //3 Lives - Player
  //10 points - last row
  //20 points - 3rd and 4rth row
  //30 points - 1st and 2nd row
  //50, 100, 300 or 500 points - Mystery ship
  // delay = 500,

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
    constructor(alienIndex, points, width, cssClass) {
      this.alienIndex = alienIndex
      this.points = points
      this.width = width
      this.class = cssClass
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
    }
    /* else{
      shoot(25, 'alien')
    }*/
  }

  //ADD AND REMOVE PLAYER DIRECTION
  function movePlayer(playerIndex, previousIndex){
    div[previousIndex].classList.remove('player')
    div[playerIndex].classList.add('player')
  }

  //moves the laser
  function movelaser(){
    //console.log(laser.timerId)
    const previousShoot = laser.shottingIndex
    if(laser.shooter === 'user')laser.moveUp()
    else laser.moveDown()
    if(laser.shottingIndex<0 || laser.shottingIndex>div.length){
      clearInterval(laser.shootingTimerId)
      div[previousShoot].classList.remove(laser.class)
      laser = undefined
    }else{
      div[previousShoot].classList.remove(laser.class)
      div[laser.shottingIndex].classList.add(laser.class)
    }
    if(laser)checkHit(laser.shottingIndex, laser.class, laser.shootingTimerId)
    //timerId = setTimeout(movelaser, 30)
  }

  //CREATES A laser OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex, shooter){
    shootingIndex = playerIndex
    laser = new Shooting(shootingIndex,width,0,shooter, 'shooting')
    //timerId = setInterval(()=>movelaser('abc'), 30)
    timerId = setInterval(movelaser, 30)
    if(laser.shootingTimerId===0)laser.shootingTimerId = timerId
    movelaser()
  }

  //CREATE THE ALIEN OBJECT USING THE ALIEN CLASS
  function alienCreate(index){
    //'alien'
    let points = 30, className = 'alien3'
    for(let i = 0; i<alien*alienRow; i++) {
      const aliens = new Alien(index , points, width, className)
      div[aliens.alienIndex].classList.add(className)
      alienArray.push(aliens)
      index++
      if((i+1) % alien ===0)index = (index+width)-(alien)
      if((i+1)%(alien*Math.floor(alienRow/2))===0){
        points -= 10
        className = 'alien' + (parseInt(className[className.length-1])-1)
        console.log(parseInt(className[className.length-1]))
      }
    }
  }

  //function to check weahther to end the game
  function checkEnd(){
    if(alienArray.length === 0 ){
      clearInterval(gameTimerId)
      if(level<=7)delay -= 50
      level++
      startGame()
    }else{
      alienArray.forEach((elem)=>{
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
    document.removeEventListener('keydown', handleKeydown)
    clearInterval(gameTimerId)
    clearInterval(timerId)
    //addScore('You',score)
    //name = prompt(`You manged to sorce ${score}`)
    //if(name) alert(`${name} score ${score}`)
  }

  //Fuction to store in the localStorage
  // function addScore(user,score){
  //   const userScore ={
  //     user: user,
  //     score: score
  //   }
  //   highScoreArray.push(userScore)
  //   localStorage.setItem('HighScore', JSON.stringify(highScoreArray))
  // }
  //Function to retrive it form  localStorage
  function displayScore(){
    if(highScoreArray.length===1)console.log(highScoreArray[0]['user'])
    else if(highScoreArray.length >= 2)console.log(highScoreArray.sort((a,b) => a['score']-b['score']).reverse())
    else console.log('no highscore')
  }
  //move the alien index
  function moveAlien(move){
    alienArray.forEach(elem=>{
      if(move === 'left'){
        elem.moveLeft()
      }else if(move=== 'right'){
        elem.moveRight()
      } else{
        elem.moveDown()
      }
    })
    displayAlienmove()
  }

  //check for wall collsion
  function checkAlienindex(){
    alienArray.forEach(elem=>{
      if((elem.alienIndex+1)%width === 0 || elem.alienIndex%width === 0){
        changePosition = true
      }
    })
  }

  //display the alien movement
  function displayAlienmove(){
    //removes the aliens
    div.forEach(divs => {
      if(divs.classList.value === 'alien1' || divs.classList.value === 'alien2' || divs.classList.value === 'alien3'){
        divs.classList.remove(divs.classList.value)
      }
    })
    //repaints the aliens
    alienArray.forEach(alien => {
      div[alien.alienIndex].classList.add(alien.class)
    })
  }

  //function that get random number
  function probailityOfHappening(probability){
    const ran =Math.random()
    if(ran < probability){
      console.log(motherShipPoint[Math.floor((ran*100) % motherShipPoint.length)])
    }
  }

  //collision dection  to check if the users hit the alien
  function checkHit(laserIndex, className, timerId){
    alienArray.forEach(elem =>{
      if(!!elem.alienIndex && elem.alienIndex === laserIndex && laser.shooter === 'user'){
        clearInterval(timerId)
        div[laserIndex].classList.remove(className)
        div[laserIndex].classList.remove(elem.class)
        score += elem.points
        alienArray = alienArray.filter(elem => elem.alienIndex !== laserIndex)
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
      //if(!motherShip)probailityOfHappening(0.2)
    }, delay)
  }

  function startGame(){
    userLevel.innerText = level
    alienCreate(23)
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
    div[playerIndex].classList.add('player')
    startGame()
    //removes the setitems form localStorage
    //console.log(localStorage.removeItem('HighScore'))//.remove('HighScore')
    displayScore()

  }

  init()
})
