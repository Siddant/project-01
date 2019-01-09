document.addEventListener('DOMContentLoaded', () => {
  const width = 20//, motherShipPoint = [50, 100, 300, 500]
  const grid = document.querySelector('.grid')
  const userScore = document.querySelector('#score')
  const gameOver  = document.querySelector('.gameEnd')
  const userName = gameOver.querySelector('input')
  const userLevel = document.querySelector('#level')
  const userLives = document.querySelector('#lives')
  const btns = document.querySelectorAll('.buttonholder button')
  const startMenu  = document.querySelector('.startMenu')
  const instruction  = document.querySelector('.instruction')
  const highScore  = document.querySelector('.highScore')
  const highScoreArray = JSON.parse(localStorage.getItem('HighScore')) || []
  const alien = 11, alienRow = 5

  let playerIndex, timerId, shootingIndex, div, score = 0,
    gameTimerId, move = 'right', changePosition =false,
    level = 1,  delay = 500//, motherShip
  //used to store the alien object and can be used in a global aspect
  let alienArray = [], lives = 3
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
    set index(index){
      this.alienIndex = index
    }
    get index(){
      return this.alienIndex
    }
    set directionMovemnt(direction){
      this.movment = direction
    }
    get directionMovemnt(){
      return this.movment
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
    checkEdge(){
      return (this.alienIndex+1)%width === 0 || this.alienIndex%width === 0
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
    }else if (e.keyCode === 39 && playerIndex<(div.length-1)){
      playerIndex++
    }else if (e.keyCode === 32){
      //restrice users from spamming space to shoot all the time
      //if(!laser){
      shoot(playerIndex, 'user', 'shooting')
      //}
    }
    movePlayer(playerIndex, previousIndex, 'player')
  }

  //ADD AND REMOVE PLAYER DIRECTION
  function movePlayer(playerIndex, previousIndex, display){
    div[previousIndex].classList.remove(display)
    div[playerIndex].classList.add(display)
  }

  //moves the laser
  function movelaser(laser){
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
    if(laser)checkHit(laser.shottingIndex, laser.class, laser.timerId, laser.shooter)
    //if(laser && motherShip)checkHitagainstMotheShip(laser.shottingIndex, laser.class, laser.shootingTimerId)

  //timerId = setTimeout(movelaser, 30)
  }


  //collision dection  to check if the users hit the alien
  function checkHit(laserIndex, className, timerId, laser){
    alienArray.forEach(elem =>{
      if(!!elem.alienIndex && elem.alienIndex === laserIndex && laser === 'user'){
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
    if(laserIndex === playerIndex && laser !== 'user'){
      console.log('hit')
      lives--
      userLives.innerText = lives
    }
    div.forEach(divs => {
      if(divs.classList.value === 'alienShooting shooting' || divs.classList.value === 'shooting alienShooting' ){
        console.log('collision')
      }
    })
  }

  //CREATES A laser OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex, shooter, className){
    shootingIndex = playerIndex
    const laser = new Shooting(shootingIndex,width,0,shooter, className)
    //timerId = setInterval(()=>movelaser('abc'), 30)
    timerId = setInterval(()=> movelaser(laser), 30)
    if(laser.shootingTimerId===0)laser.shootingTimerId = timerId
  }


  function alienShoots(){
    const shootIndx = probailityOfHappening(0.2, alienArray)
    //const shootIndx =1
    if(shootIndx){
      //div[shootIndx.alienIndex].style.backgroundColor= 'red'
      shoot(shootIndx.alienIndex, 'alien','alienShooting')
    }
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
      }
    }
  }

  //function to check weahther to end the game
  function checkEnd(){
    if(alienArray.length === 0 ){
      clearInterval(gameTimerId)
      if(level<=7)delay -= 50
      level++
      lives++
      startGame()
    }else if(lives <=0){
      delay = 500
      lives =3
      level = 1
      alienArray = []
      endGame()
    }else{
      alienArray.forEach((elem)=>{
        if(elem.alienIndex+1 > div.length-(width*2)){
          delay = 500
          lives =3
          level =1
          alienArray = []
          endGame()
        }
      })
    }
    userLives.innerText = lives
  }

  //ENDS THE GAME
  function endGame(){
    clearInterval(gameTimerId)
    grid.style.display='none'
    gameOver.style.display='flex'
    const userScored = gameOver.querySelector('h2 span')
    userScored.innerText = score
    displayAlienmove()
  }

  //Fuction to store in the localStorage
  function addScore(user,score){
    const userScore ={
      user: user,
      score: score
    }
    highScoreArray.push(userScore)
    localStorage.setItem('HighScore', JSON.stringify(highScoreArray))
  }

  //Function to retrive it form  localStorage
  function displayScore(){
    //const highScore
    const listOfScore = highScore.querySelector('.listOfScore')
    const modified = highScoreArray.sort((a,b) => a['score']-b['score']).reverse().slice(0,10)
    let text = ''
    if(highScoreArray.length === 0){
      text = '<p> no highscore</p>'
    }else{
      modified.forEach((elemn, index) =>{
        text+= `<p>${index+1}. ${elemn.user} ${elemn.score}</p>`
      })
    }
    listOfScore.innerHTML = text
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

  // function moveMotheShip(){
  //   const previousIndex = motherShip.index
  //   if(motherShip.directionMovemnt === 'left'){
  //     motherShip.moveLeft()
  //   }else if(motherShip.directionMovemnt === 'right'){
  //     motherShip.moveRight()
  //   } else{
  //     motherShip.moveDown()
  //   }
  //   if(motherShip.checkEdge()){
  //     div[motherShip.alienIndex].classList.remove(motherShip.class)
  //     motherShip = undefined
  //   }else{
  //     movePlayer(motherShip.index, previousIndex, motherShip.class)
  //   }
  // }


  //check for wall collsion
  function checkAlienindex(){
    alienArray.forEach(elem=>{
      if(elem.checkEdge()){
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
  function probailityOfHappening(probability,array){
    const ran = Math.random()
    if(ran < probability){
      return(array[Math.floor((ran*100) % array.length)])
    }
  }


  // function checkHitagainstMotheShip(laserIndex, className, timerId){
  //   if(!!motherShip.index && motherShip.index === laserIndex && !!motherShip){
  //     clearInterval(timerId)
  //     div[laserIndex].classList.remove(className)
  //     div[motherShip.index].classList.remove(motherShip.class)
  //     score += motherShip.points
  //     motherShip = undefined
  //     laser = undefined
  //     userScore.innerText = score
  //   }
  // }


  //function for motherShip
  // function bonusPoints(probaility){
  //   const points  = probailityOfHappening(probaility)
  //   const move = probailityOfHappening(0.5)
  //   if(points){
  //     motherShip = new Alien(0 , points, width, 'motherShip')
  //     if(!move){
  //       motherShip.directionMovemnt = 'left'
  //       motherShip.index = 19
  //     }else{
  //       motherShip.directionMovemnt = 'right'
  //       motherShip.index = 0
  //     }
  //     div[motherShip.index].classList.add('motherShip')
  //     console.log(motherShip)
  //   }
  // }

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
      alienShoots()
      //if(!motherShip)bonusPoints(0.1)
      //else moveMotheShip()
    }, delay)
  }

  function startGame(){
    userLevel.innerText = level
    alienCreate(23)
    startTimer()
  }


  //handles the click of the button from the users
  function handleEvent(e){
    const options = e.target.textContent
    if(options === 'Start'){
      startMenu.style.display='none'
      grid.style.display='flex'
      startGame()
    }else if(options === 'Instruction'){
      startMenu.style.display='none'
      instruction.style.display='flex'
    }else if(options === 'High Score'){
      startMenu.style.display='none'
      highScore.style.display='flex'
      displayScore()
    }else if(options === 'Go Back' || options ===  'Cancel'){
      e.target.parentElement.parentElement.style.display='none'
      startMenu.style.display='flex'
    }else{
      addScore(userName.value,score)
      e.target.parentElement.parentElement.style.display='none'
      startMenu.style.display='flex'
    }
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
    //removes the setitems form localStorage
    startGame()
    //console.log(localStorage.removeItem('HighScore'))//.remove('HighScore')
    btns.forEach(elem => {
      elem.addEventListener('click', handleEvent)
    })
  }

  init()
})
