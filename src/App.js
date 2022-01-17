import React from 'react';
import { Fragment } from 'react/cjs/react.production.min';
import './app.css'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      size: 2,
      fullNumbers: {0:2,1:2,2:null,3:null},
    }
    this.handleChange       = this.handleChange.bind(this)
    this.handleKeyUp        = this.handleKeyUp.bind(this)
    this.changefullNumbers  = this.changefullNumbers.bind(this)
    this.moveItem           = this.moveItem.bind(this)
    this.createItem         = this.createItem.bind(this)
    this.isGameOver         = this.isGameOver.bind(this)
  }
  componentDidMount() {
    window.addEventListener("keyup", this.handleKeyUp);
  }
  isGameOver(){
    let fullNumbers = JSON.parse(JSON.stringify(this.state.fullNumbers))
    let size = this.state.size
    let isAllFull = true
    let keys = Object.keys(fullNumbers)
    keys.map(i => {
      if(!fullNumbers[i]) {
        isAllFull = false
      }
      if(fullNumbers[i] == fullNumbers[i + 1] || fullNumbers[i] == fullNumbers[i + size]) {
        isAllFull = false
      }
    })
    return isAllFull
  }
  handleChange(e){
    let newObj = {}
    let max = Math.pow(e.target.value, 2)
    for(let i = 0; i < max; i++) {
      newObj[i] = null
    }
    this.setState({
      size: e.target.value,
      fullNumbers : newObj,
    },this.createItem)
    
  }
  createItem(){
    let begin_items = [2,4]
    let key_arr = []
    let fullNumbers = JSON.parse(JSON.stringify(this.state.fullNumbers))
    Object.keys(fullNumbers).map(i => {
      if(!fullNumbers[i]) {
        key_arr.push(i)
      }
    })
    let k = this.randomNum(0, key_arr.length - 1)
    let i = this.randomNum(0, 1)
    fullNumbers[key_arr[k]] = begin_items[i]
    this.setState({
      fullNumbers: fullNumbers
    })
  }
  randomNum = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
  }
  createBoard(){
    let rows = []
    let max_size = Math.pow(this.state.size, 2)
    for(let i = 0; i < max_size; i++) {
      rows.push(<div className='item' key={i}>{this.state.fullNumbers[i]}</div>)
    }
    return rows
  }
  changefullNumbers(type){
    let func = null
    if(type == 'top') {
      func = (keys, i, size) => keys.filter(key => key % size == i)
    }
    if(type == 'bottom') {
      func = (keys, i, size) => keys.filter(key => key % size == i).reverse()
    }
    if(type == 'left') {
      func = (keys, i, size) => keys.filter(key => Math.floor(key / size) == i)
    }
    if(type == 'right') {
      func = (keys, i, size) => keys.filter(key => Math.floor(key / size) == i).reverse()
    }

    let size = this.state.size
    let keys = Object.keys(this.state.fullNumbers)
    let noMoves = 0
    for(let i = 0; i < size; i++) {
      let new_arr = []
      new_arr = func(keys, i, size)
      if(this.moveItem(new_arr)) {
        noMoves++
      }
      new_arr = []
    }
    if(noMoves == size && this.isGameOver()){
        alert('游戏结束')
        this.handleChange({target:{value: this.state.size}})
        return
    }
    if(noMoves != size) {
      this.createItem()
    }
    
  }
  moveItem(keys_array) {
    let fullNumbers = JSON.parse(JSON.stringify(this.state.fullNumbers))
    let isGo = false
    let key_length = keys_array.length
    for(let i = 1; i < key_length; i++) {
      if(fullNumbers[keys_array[i]] && fullNumbers[keys_array[i - 1]]){
        if(fullNumbers[keys_array[i]] == fullNumbers[keys_array[i - 1]]) {
          fullNumbers[keys_array[i - 1]] *= 2
          fullNumbers[keys_array[i]] = null
          isGo = true
        }
      }
      if(fullNumbers[keys_array[i]] && !fullNumbers[keys_array[i - 1]]) {
        fullNumbers[keys_array[i - 1]] = fullNumbers[keys_array[i]]
        fullNumbers[keys_array[i]] = null
        isGo = true
      }
    }
    if(!isGo) {
      return !isGo
    }
    this.setState({
      fullNumbers: fullNumbers
    },() => {
      if(isGo) {
        isGo = this.moveItem(keys_array)
      }
    })
  }
  handleKeyUp(e){
    switch(e.code) {
      case 'KeyD' : this.changefullNumbers('right');break;
      case 'KeyS' : this.changefullNumbers('bottom');break;
      case 'KeyA' : this.changefullNumbers('left');break;
      case 'KeyW' : this.changefullNumbers('top');break;
      default: {

      }
    }
  }
  render(){
    return (
      <Fragment>
      <input className='inputSize' type="number" value={this.state.size} onChange={this.handleChange}/>
      <div className="Board" onKeyUp={this.keyUp} style={{ width: this.state.size * 100 + 'px'}}>
        {this.createBoard()}
      </div>
    </Fragment>
    )
  }
}

export default App;
