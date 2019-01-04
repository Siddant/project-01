document.addEventListener('DOMContentLoaded', () => {
  //const h1 = document.querySelector('h1')
  const width = 20
  const grid = document.querySelector('.grid')
  const alien = 11
  const alienRow = 5
  let playerIndex, previousIndex, timerId, shootingIndex, div, score =0, playerShoot, gameTimerId, goDown

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
    constructor(playeIndex, width, timerId) {
      this.shootingIndex = playeIndex
      this.width  =  width
      this.timerId = timerId
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
    constructor(alienIndex, points, position) {
      this.alienIndex = alienIndex
      this.points = points
      this.width = 20
      this.position = position
      this.down = false
    }
    set movePoistion(position){
      this.position = position
    }
    get movePoistion(){
      return this.position
    }
    set goDown(down){
      this.down = down
    }
    get goDown(){
      return this.down
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
    previousIndex = playerIndex
    if(e.keyCode === 37 && playerIndex>(div.length-width)){
      playerIndex--
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 39 && playerIndex<(div.length-1)){
      playerIndex++
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 32){
      //restrice users from spamming space to shoot all the time
      if(!playerShoot){
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
    shootingIndex = playerIndex
    playerShoot = new Shooting(shootingIndex,width,0)
    timerId = setInterval(()=> {
      playerShoot.moveUp()
      if(playerShoot.shottingIndex<0){
        clearInterval(playerShoot.shootingTimerId)
        div[playerShoot.shottingIndex+width].classList.remove(classname)
        playerShoot = undefined
      }else{
        div[playerShoot.shottingIndex+width].classList.remove(classname)
        div[playerShoot.shottingIndex].classList.add(classname)
      }
      if(playerShoot)checkHit(playerShoot.shottingIndex, classname, playerShoot.shootingTimerId)
    }, 60)
    arr.forEach(elem =>{
      moveAlien(elem)
    })
    if(playerShoot.shootingTimerId===0)playerShoot.shootingTimerId = timerId
  }

  //CREATE THE ALIEN OBJECT USING THE ALIEN CLASS
  function alienCreate(index, className){
    let startPosition = index
    let endPosiition = startPosition+alien
    let points = 30
    //alien*alienRow
    for(let i = 0; i<alien*1; i++) {
      if(startPosition === endPosiition){
        endPosiition+=width
        startPosition= (startPosition-10)+20
      }else{
        startPosition++
      }
      if(startPosition === (index+20+1) || startPosition === (index+60+1) ){
        points -= 10
      }
      const aliens = new Alien(startPosition , points, 'right')
      div[aliens.alienIndex].classList.add(className)
      arr.push(aliens)
    }
  }

  //move the alien
  function moveAlien(elem){
    previousIndex = elem.alienIndex
    checkAlienindex(elem)
    if(goDown && elem.goDown){
      elem.moveDown()
    }else if(elem.movePoistion === 'left'){
      elem.moveLeft()
    }else{
      elem.moveRight()
    }
    div[previousIndex].classList.remove('alien')
    div[elem.alienIndex].classList.add('alien')
  }

  function checkAlienindex(elem){
    if (goDown && elem.goDown){
      goDown = false
      elem.goDown = false
      if(elem.movePoistion === 'left'){
        elem.movePoistion = 'right'
      }else{
        elem.movePoistion = 'left'
      }
    }else if (((elem.alienIndex+1)%20===0) || ((elem.alienIndex)%20===0)) {
      goDown = true
      elem.goDown = true
    }
  }

  //collision dection  to check if the users hit the alien
  function checkHit(playerShootindx, className, timerId){
    arr.forEach(elem =>{
      if(!!elem.alienIndex && elem.alienIndex === playerShootindx){
        clearInterval(timerId)
        div[playerShootindx].classList.remove(className)
        div[playerShootindx].classList.remove('alien')
        score += elem.points
        elem = undefined
        playerShoot = undefined
      }
    })
    arr = arr.filter(elem => elem.alienIndex !== playerShootindx)
  }

  // start the timer
  function startTimer(delay){
    gameTimerId =  setInterval(()=> {
      arr.forEach(elem =>{
        moveAlien(elem)
      })
    }, delay)
  }

  //INITIALIZE THE GAME
  function init(){
    for(let i = 0; i<width*width; i++) {
      addElement()
    }
    div = document.querySelectorAll('.grid div')
    document.addEventListener('keydown', handleKeydown)
    alienCreate(23,'alien')
    //caluclate the player position, which is the center of the bottom of the screen
    playerIndex = (div.length-1)-(width/2)
    div[playerIndex].classList.add('player')
    startTimer(500)
  }


  init()
})
