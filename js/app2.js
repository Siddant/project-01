document.addEventListener('DOMContentLoaded', () => {
  const width =20
  const grid = document.querySelector('.grid')
  let div, playerIndex,shootingIndex, timerId
  let alienArray = []

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



  //CREATE THE ALIEN OBJECT USING THE ALIEN CLASS
  function alienCreate(index){
  //'alien'
    let points = 30, className = 'alien3'
    for(let i = 0; i<11*5; i++) {
      const aliens = new Alien(index , points, width, className)
      div[aliens.alienIndex].classList.add(className)
      alienArray.push(aliens)
      index++
      if((i+1) % 11 ===0)index = (index+width)-(11)
      if((i+1)%(11*Math.floor(5/2))===0){
        points -= 10
        className = 'alien' + (parseInt(className[className.length-1])-1)
      }
    }
  }




  //CREATE DIVS AND ADD DIVS
  function addElement() {
    const newDiv = document.createElement('div')
    grid.appendChild(newDiv)
  }

  //HANDLE PLAYER EVENTS
  function handleKeydown(e){
    //const previousIndex = playerIndex
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
  }

  //CREATES A laser OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex, shooter, className){
    shootingIndex = playerIndex
    const laser = new Shooting(shootingIndex,width,0,shooter, className)
    movelaser(laser)
    if(laser.shootingTimerId===0)laser.shootingTimerId = timerId
    console.log(timerId)
  }

  //

  //moves the laser
  function movelaser(laser){
    const previousShoot = laser.shottingIndex
    const hit  = checkHit(laser.shottingIndex, laser.class, laser.timerId, laser.shooter)
    console.log(laser.shottingIndex)

    console.log(hit)
    if(laser.shooter === 'user')laser.moveUp()
    else laser.moveDown()
    if(laser.shottingIndex<0 || laser.shottingIndex>div.length){
    //   div[previousShoot].classList.remove(laser.class)
    //   div[previousShoot].classList.remove(laser.class)
    //   clearTimeout(laser.shootingTimerId)
    //   laser = undefined
    //   clearTimeout(laser.shootingTimerId)
      clearInterval(timerId)
    //}
    // }else if(checkHit(laser.shottingIndex, laser.class, laser.timerId, laser.shooter)){
    //   console.log('here')
    //   clearInterval(timerId)
    //
    }else{
    //checkHit(laser.shottingIndex, laser.class, laser.timerId, laser.shooter)
      div[previousShoot].classList.remove(laser.class)
      div[laser.shottingIndex].classList.add(laser.class)
      timerId = setTimeout(()=>movelaser(laser), 20)
    }


    //if(laser)checkHit(laser.shottingIndex, laser.class, laser.timerId, laser.shooter)
    //if(laser && motherShip)checkHitagainstMotheShip(laser.shottingIndex, laser.class, laser.shootingTimerId)
  }

  //collision dection  to check if the users hit the alien
  function checkHit(laserIndex, className, timerId, laser){
    alienArray.forEach(elem =>{
      console.log(`laser index${laserIndex}`)
      //console.log(`alien index ${elem.alienIndex}`)

      if(!!elem.alienIndex && elem.alienIndex === laserIndex && laser === 'user'){
        console.count('here')
        return true
      }else{
        return false
      }
    })
  }


  //INITIALIZE THE GAME
  function init(){
    for(let i = 0; i<width*width; i++) {
      addElement()
    }
    div = document.querySelectorAll('.grid div')
    alienCreate(23)

    // //caluclate the player position, which is the center of the bottom of the screen
    playerIndex = (div.length-1)-Math.floor(width/2)
    document.addEventListener('keydown', handleKeydown)
    div[playerIndex].classList.add('player')
    console.log(alienArray)
  }

  init()
})
