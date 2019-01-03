document.addEventListener('DOMContentLoaded', () => {
  //const h1 = document.querySelector('h1')
  const width = 20
  const grid = document.querySelector('.grid')

  let playerIndex, previousIndex, timerId, shootingIndex, div



  function addElement () {
    const newDiv = document.createElement('div')
    grid.appendChild(newDiv)
  }



  function handleKeydown(e){
    previousIndex = playerIndex
    if(e.keyCode === 37 && playerIndex>(div.length-width)){
      playerIndex--
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 39 && playerIndex<(div.length-1)){
      playerIndex++
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 32){
      shoot(playerIndex)
    }
  }

  function movePlayer(playerIndex, previousIndex){
    div[previousIndex].classList.remove('player')
    div[playerIndex].classList.add('player')
  }



  class Shooting {
    constructor(playeIndex, width, timerId) {
      this.playeIndex = playeIndex
      this.width  =  width
      this.timerId = timerId
    }
    get shottingIndex() {
      return this.playeIndex
    }
    set currentIndex(minus) {
      this.playeIndex = minus
    }
    get previousShootingIndex(){
      return this.playeIndex + this.width
    }

    set shootingTimerId(minus) {
      this.timerId = minus
    }
    get shootingTimerId() {
      return this.timerId
    }
  }


  function shoot(playerIndex){
    shootingIndex = playerIndex
    //clearInterval(timerId)
    let playerShoot = new Shooting(shootingIndex,width,0)
    timerId = setInterval(()=> {
      playerShoot.currentIndex = playerShoot.shottingIndex - width
      if(playerShoot.shootingTimerId===0)playerShoot.shootingTimerId = timerId
      if(playerShoot.shottingIndex<0){
        clearInterval(playerShoot.shootingTimerId)
        div[playerShoot.shottingIndex+width].classList.remove('player')
        console.log(playerShoot.timerId)
        playerShoot = null
      }else{
        if((playerShoot.shottingIndex+width)!==playerIndex)div[playerShoot.shottingIndex+width].classList.remove('player')
        div[playerShoot.shottingIndex].classList.add('player')
      }
    }, 300)
  }

  function init(){
    for(let i = 0; i<width*width; i++) {
      addElement()
    }
    div = document.querySelectorAll('.grid div')
    playerIndex = (div.length-1)-(width/2)
    div[playerIndex].classList.add('player')
  }


  init()



  document.addEventListener('keydown', handleKeydown)



})
