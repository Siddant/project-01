document.addEventListener('DOMContentLoaded', () => {
  const width = 20, motherShipPoint = [50, 100, 300, 500]
  const grid = document.querySelector('.grid')
  const userScore = document.querySelector('#score')
  const gameOver  = document.querySelector('.gameEnd')
  const userName = gameOver.querySelector('input')
  const userLevel = document.querySelector('#level')
  //const userLives = document.querySelector('#lives')
  const btns = document.querySelectorAll('.buttonholder button')
  const startMenu  = document.querySelector('.startMenu')
  const instruction  = document.querySelector('.instruction')
  const highScore  = document.querySelector('.highScore')
  const detail = document.querySelector('.users-detail')
  const highScoreArray = JSON.parse(localStorage.getItem('HighScore')) || []
  const alien = 11, alienRow = 5
  const userScored = gameOver.querySelector('h2 span')
  const damage =  document.querySelector('#damageBar')

  let playerIndex, timerId, shootingIndex, div, score = 0,
    gameTimerId, move = 'right', changePosition =false,
    level = 1,  delay = 750, currentStep =1, motherShip,motherShipTimerId,
    usersLaser,alienArray = [], lives = 5,  ran

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

  //CREATE DIV AND ADD DIVS
  function addElement() {
    const newDiv = document.createElement('div')
    grid.appendChild(newDiv)
  }

  //HANDLE PLAYER EVENTS
  function handleKeydown(e){
    const previousIndex = playerIndex
    if(e.keyCode === 37 && playerIndex>(div.length-(width*2))){
      playerIndex--
    }else if (e.keyCode === 39 && playerIndex<((div.length-width)-1)){
      playerIndex++
    }else if (e.keyCode === 32){
      //restrice users from spamming space to shoot all the time
      if(!usersLaser)shoot(playerIndex, 'user', 'shooting')
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
    // if(laser.shottingIndex){
    const previousShoot = laser.shottingIndex
    if(laser.shooter === 'user'){
      laser.moveUp()
    }else{
      laser.moveDown()
    }
    if(laser.shottingIndex <= 0 || laser.shottingIndex>=div.length){
      clearInterval(laser.shootingTimerId)
      div[previousShoot].classList.remove(laser.class)
      if(laser.shooter === 'user'){
        usersLaser = undefined
      }else laser = undefined
    }else{
      div[laser.shottingIndex].classList.add(laser.class)
      div[previousShoot].classList.remove(laser.class)
      if(laser)checkHit(laser.shottingIndex, laser.class, laser.timerId, laser.shooter)
    }
    // }
  }


  function checkHit(laserIndex, className, timerId, laser){
    if(laserIndex === playerIndex && laser !== 'user'){
      clearInterval(timerId)
      const hit = parseFloat(damage.style.width) || 0
      lives--
      damage.style.width = (hit+(100/5)) +'%'
      laser = undefined
      div[laserIndex].classList.remove(className)
      //userLives.innerText = lives
    }else if(motherShip && laserIndex === motherShip.alienIndex && laser === 'user'){
      clearInterval(timerId)
      clearTimeout(motherShipTimerId)
      div[laserIndex].classList.remove(className)
      div[motherShip.alienIndex].classList.remove(motherShip.class)
      score += motherShip.points
      motherShip = undefined
      usersLaser = undefined
      userScore.innerText = score
      div[laserIndex].classList.add('explosion')
      explosionAnimation(laserIndex)
    }else{
      alienArray.forEach(elem =>{
        if(!!elem.alienIndex && elem.alienIndex === laserIndex && laser === 'user'){
          clearInterval(timerId)
          alienArray = alienArray.filter(elem => elem.alienIndex !== laserIndex)
          div[laserIndex].classList.remove(elem.class)
          score += elem.points
          elem = undefined
          div[laserIndex].classList.remove(className)
          usersLaser = undefined
          userScore.innerText = score
          div[laserIndex].classList.add('explosion')
          explosionAnimation(laserIndex)
        }
      })
    }
  }

  //CREATES A laser OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex, shooter, className){
    shootingIndex = playerIndex
    if(shooter === 'user'){
      usersLaser = new Shooting(shootingIndex-width,width,0,shooter, className)
      timerId = setInterval(()=> movelaser(usersLaser), 30)
      if(usersLaser.shootingTimerId===0)usersLaser.shootingTimerId = timerId
    }else{
      const laser = new Shooting(shootingIndex,width,0,shooter, className)
      timerId = setInterval(()=> movelaser(laser), 50)
      if(laser.shootingTimerId===0)laser.shootingTimerId = timerId
    }
  }

  //function explosion
  function explosionAnimation(laserIndex){
    let explosionId
    if(currentStep >= 14){
      clearTimeout(explosionId)
      currentStep = 0
      div[laserIndex].classList.remove('explosion')
      div[laserIndex].removeAttribute('data-explosion')
    } else{
      div[laserIndex].dataset.explosion = currentStep
      currentStep = currentStep + 1
      explosionId = setTimeout(()=>explosionAnimation(laserIndex), 10)
    }
  }

  function alienShoots(){
    const shootIndx = probailityOfHappening(0.2, alienArray)
    if(shootIndx){
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
      if(level<=7)delay -= 70
      level++
      startGame()
    }else if(lives <=0){
      endGame()
    }else{
      alienArray.forEach((elem)=>{
        if(elem.alienIndex+1 > div.length-(width*2)){
          endGame()
        }
      })
    }
    //userLives.innerText = lives
  }

  //ENDS THE GAME
  function endGame(){
    clearInterval(gameTimerId)
    grid.style.display='none'
    gameOver.style.display='flex'
    userScored.innerText = score
    detail.style.display ='none'
    alienArray = []
    level =1
    delay = 750
    move = 'right'
    changePosition =false
    damage.style.width = 0
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
    const modified = highScoreArray.sort((a,b) => b['score']-a['score']).slice(0,10)
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
      if(divs.classList.contains('alien1') || divs.classList.contains( 'alien2') || divs.classList.contains( 'alien3')){
        divs.classList.remove('alien1','alien2','alien3')
      }
    })
    //repaints the aliens
    alienArray.forEach(alien => {
      div[alien.alienIndex].classList.add(alien.class)
    })
  }

  //function that get random number
  function probailityOfHappening(probability,array){
    ran = Math.random()
    if(ran < probability){
      return(array[Math.floor((ran*100) % array.length)])
    }
  }

  function moveBonusShip(){
    const previousIndex = motherShip.alienIndex
    if(motherShip.checkEdge()){
      div[motherShip.alienIndex].classList.remove(motherShip.class)
      clearTimeout(motherShipTimerId)
      motherShip = undefined
    }else{
      if(motherShip.directionMovemnt === 'left'){
        motherShip.moveLeft()
      }else{
        motherShip.moveRight()
      }
      movePlayer(motherShip.alienIndex, previousIndex, motherShip.class)
      motherShipTimerId = setTimeout(moveBonusShip, 300)
    }
  }

  //function for motherShip
  function bonusPoints(probaility){
    const points  = probailityOfHappening(probaility, motherShipPoint)
    if(points){
      motherShip = new Alien(0 , points, width, 'motherShip')
      if(Math.floor(ran*100)%2 === 0){
        motherShip.directionMovemnt = 'left'
        motherShip.index = 39-1
      }else{
        motherShip.directionMovemnt = 'right'
        motherShip.index = 20+1
      }
      div[motherShip.index].classList.add('motherShip')
      moveBonusShip()
    }
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
      alienShoots()
      if(!motherShip)bonusPoints(0.03)
    }, delay)
  }

  function startGame(){
    displayAlienmove()
    userLevel.innerText = level
    alienCreate(43)
    startTimer()
    userScored.innerText = score
  }

  //handles the click of the button from the users
  function handleEvent(e){
    const options = e.target.textContent
    if(options === 'Start'){
      lives =5
      startMenu.style.display='none'
      detail.style.display ='flex'
      grid.style.display='flex'
      document.body.style.backgroundImage = 'url(\'assets/background-Images/0.png\')'
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
      score = 0
      document.body.style.backgroundImage = 'url(\'assets/background-Images/start-menu.jpg\')'
    }else{
      addScore(userName.value,score)
      e.target.parentElement.parentElement.style.display='none'
      startMenu.style.display='flex'
      score = 0
      document.body.style.backgroundImage = 'url(\'assets/background-Images/start-menu.jpg\')'
    }
    userScore.innerText = score
  }

  //INITIALIZE THE GAME
  function init(){
    for(let i = 0; i<width*width; i++) {
      addElement()
    }
    div = document.querySelectorAll('.grid div')
    //caluclate the player position, which is the center of the bottom of the screen
    playerIndex = ((div.length-width)-1)-Math.floor(width/2)
    document.addEventListener('keydown', handleKeydown)
    div[playerIndex].classList.add('player')
    //localStorage.removeItem('HighScore')
    //console.log(localStorage.removeItem('HighScore'))//.remove('HighScore')
    btns.forEach(elem => {
      elem.addEventListener('click', handleEvent)
    })

  }
  init()
})
