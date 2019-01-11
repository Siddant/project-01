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
    level = 1,  delay = 100, currentStep =1, motherShip,motherShipTimerId,
    usersLaser

  //used to store the alien object and can be used in a global aspect
  let alienArray = [], lives = 5,  ran
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
      if(!usersLaser)shoot(playerIndex, 'user', 'shooting')
    }
    movePlayer(playerIndex, previousIndex, 'player')
  }


  //CREATES A laser OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex, shooter, className){
    shootingIndex = playerIndex
    if(shooter === 'user'){
      usersLaser = new Shooting(shootingIndex,width,0,shooter, className)
      timerId = setInterval(()=> movelaser(usersLaser), 30)
      if(usersLaser.shootingTimerId===0)usersLaser.shootingTimerId = timerId
    }else{
      const laser = new Shooting(shootingIndex,width,0,shooter, className)
      timerId = setInterval(()=> movelaser(laser), 30)
      if(laser.shootingTimerId===0)laser.shootingTimerId = timerId
    }
  }

  //moves the laser
  function movelaser(laser){
    const previousShoot = laser.shottingIndex
    if(laser.shooter === 'user'){
      laser.moveUp()
      console.log('user id:' +laser.shootingTimerId)
    }else{
      laser.moveDown()
    }
    if(laser.shottingIndex<0 || laser.shottingIndex>div.length){
      div[previousShoot].classList.remove(laser.class)
      clearInterval(laser.shootingTimerId)
      if(laser.shooter === 'user') usersLaser = undefined
      else laser = undefined
    }else{
      div[previousShoot].classList.remove(laser.class)
      div[laser.shottingIndex].classList.add(laser.class)
      if(laser)checkHit(laser.shottingIndex, laser.class, laser.timerId, laser.shooter)
    }
  }

  function checkHit(laserIndex, className, timerId, laser){

    if(laserIndex === playerIndex && laser !== 'user'){
      const hit = parseFloat(damage.style.width) || 0
      lives--
      console.log(lives)
      damage.style.width = (hit+(100/5)) +'%'
      clearInterval(timerId)
      laser = undefined
      div[laserIndex].classList.remove(className)
      //userLives.innerText = lives
    }else if(motherShip && laserIndex === motherShip.alienIndex && laser === 'user'){
      clearInterval(timerId)
      //clearTimeout(motherShipTimerId)
      div[laserIndex].classList.remove(className)
      div[motherShip.alienIndex].classList.remove(motherShip.class)
      score += motherShip.points
      //motherShip = undefined
      usersLaser = undefined
      userScore.innerText = score
      //div[laserIndex].classList.add('explosion')
      //explosionAnimation(laserIndex)
    }else{
      alienArray.forEach(elem =>{
        if(!!elem.alienIndex && elem.alienIndex === laserIndex && laser === 'user'){
          alienArray = alienArray.filter(elem => elem.alienIndex !== laserIndex)
          //alienArray.slice(3)
          div[laserIndex].classList.remove(elem.class)
          score += elem.points
          elem = undefined
          clearInterval(timerId)
          div[laserIndex].classList.remove(className)
          usersLaser = undefined
          userScore.innerText = score
          //div[laserIndex].classList.add('explosion')
          //explosionAnimation(laserIndex)
        }
      })
    }

    // div.forEach(divs => {
    //   if(divs.classList.value === 'alienShooting shooting' || divs.classList.value === 'shooting alienShooting' ){
    //   }
    // })
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


  //ADD AND REMOVE PLAYER DIRECTION
  function movePlayer(playerIndex, previousIndex, display){
    div[previousIndex].classList.remove(display)
    div[playerIndex].classList.add(display)
  }

  function alienShoots(){
    const shootIndx = probailityOfHappening(0.2, alienArray)
    if(shootIndx){
      shoot(shootIndx.alienIndex, 'alien','alienShooting')
    }
  }

  //function that get random number
  function probailityOfHappening(probability,array){
    ran = Math.random()
    if(ran < probability){
      return(array[Math.floor((ran*100) % array.length)])
    }
  }


  // start the timer
  function startTimer(){
    gameTimerId = setInterval(()=> {
      if(changePosition){
        //moveAlien('down')
        if(move ==='left'){
          move ='right'
        }else{
          move ='left'
        }
        changePosition = false
      }else{
        //moveAlien(move)
        //checkAlienindex()
      }
      //checkEnd()
      alienShoots()
      //if(!motherShip)bonusPoints(0.05)
      if(usersLaser)console.log(usersLaser.shootingTimerId)
    }, delay)
  }

  function startGame(){
    userLevel.innerText = level
    alienCreate(23)
    startTimer()
    userScored.innerText = score
  }




  //handles the click of the button from the users
  function handleEvent(e){
    const options = e.target.textContent
    if(options === 'Start'){
      startMenu.style.display='none'
      detail.style.display ='flex'
      grid.style.display='flex'
      //document.body.style.backgroundImage = `url('assets/background-Images/${level%6}.png')`
      document.body.style.backgroundImage = 'url(\'assets/background-Images/0.png\')'
      startGame()
    }else if(options === 'Instruction'){
      startMenu.style.display='none'
      instruction.style.display='flex'
    }else if(options === 'High Score'){
      startMenu.style.display='none'
      highScore.style.display='flex'
      //displayScore()
    }else if(options === 'Go Back' || options ===  'Cancel'){
      e.target.parentElement.parentElement.style.display='none'
      startMenu.style.display='flex'
      score = 0
      document.body.style.backgroundImage = 'url(\'assets/background-Images/start-menu.jpg\')'
    }else{
      //addScore(userName.value,score)
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
    playerIndex = (div.length-1)-Math.floor(width/2)
    document.addEventListener('keydown', handleKeydown)
    div[playerIndex].classList.add('player')
    //console.log(localStorage.removeItem('HighScore'))//.remove('HighScore')
    //console.log(localStorage)
    btns.forEach(elem => {
      elem.addEventListener('click', handleEvent)
    })
  }

  init()
})
