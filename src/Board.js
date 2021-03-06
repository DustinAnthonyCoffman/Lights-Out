import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/


 //first we make a nested array of random boolean values, createBoard()
 //Example: let board = [[true,false,true], [false,false,true], [true,false,false],]
 //then within our render we create another nested array of rows and cells
 //within the render loops we give each cell a boolean prop "isLit" that corresponds to the other nested array at the same matchiing position 
//we do this  isLit={this.state.board[y][x]}, both [y] and [x] correspond to the nested array board[][]



class Board extends Component {

  constructor(props) {
    super(props);
    // TODO: set initial state
    this.state = {
      hasWon: false,
      board: this.createBoard()
    }
  }
static defaultProps = {
  nrows: 5,
  ncols: 5,
  chanceLightStartsOn: 0.25
};
  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  //board should be a collection of rows arrays that store random boolean values
  //createBoard is not responsible for rendering the board!!! We use the same nested for loop technique below for rendering, this is only supposed to create a values board
  createBoard() {
    let board = [];
    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < this.props.nrows; y++) {
      //create a row array for every row in props
      let row = [];
      for(let x = 0; x < this.props.ncols; x++) {
        //into the row array push true or false if random num is greater than 0.25
        row.push(Math.random() < this.props.chanceLightStartsOn)
      }
      board.push(row);
    }
    //  LOOK AT WHERE WE CALL CREATEBOARD()
    return board
  }

  /** handle changing a cell: update board & determine if winner */
// ---------------------------------------------------------------------------------------------------------------
  flipCellsAround(coord) {
    //deconstruct props for easier access FOR EXAMPLE:
    // let ncols = this.props.ncols
    // let nrows = this.props.rows
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    //split our coordinates into two numbers held by y an x
    let [y, x] = coord.split("-").map(Number);


    function flipCell(y, x) {
      // the if logic is if this coord is actually on board, flip it, meaning cant flip a 7-1 on a 5-5
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        //change the value of true to false
        board[y][x] = !board[y][x];
      }
    }
    //flip cells around selected cell
    flipCell(y, x); //flip initial cell
    flipCell(y, x - 1); //flip left
    flipCell(y, x + 1); //flip right
    flipCell(y - 1, x); //flip bottom
    flipCell(y + 1, x); //flip top

    // win when every cell is turned off
    // TODO: determine is the game has been won
    //we will use two .every methods, instead of looping through a nested array
    //The every() method tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.
    //example:
    // const isBelowThreshold = (currentValue) => currentValue < 40;
    // const array1 = [1, 30, 39, 29, 10, 13];
    // console.log(array1.every(isBelowThreshold));
    // expected output: true

    let hasWon = board.every(row => row.every(cell => !cell));

    this.setState({board: board, hasWon: hasWon});
  }
// ---------------------------------------------------------------------------------------------------------------

  /** Render game board or winning message. */

  render() {

    // if the game is won, just show a winning msg & render nothing else


    // make table board
    //this is the same function as above that creates a row for every number of rows held in nrow state
    //except instead of random true/false values we will be filling the rows with Cell components where the value of lit is the boolean value associated with the cell
    let tblBoard = [];
    for(let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x =0; x < this.props.ncols; x++) {
        //indexes of nested arrays are accessed via [][], we are accessing the values of a nested array 
        //we are pushing the value at the index of each nested array in the board array, those indexes are holding boolean values
        //row.push <Cell />
        //Cell isLit=each index of board and its value, example [1][2] would equal true/false
        let coord = `${y}-${x}`;
        row.push(<Cell 
                    key={coord} 
                    isLit={this.state.board[y][x]} 
                    flipCellsAroundMe={() => this.flipCellsAround(coord)}/>);
      }
      tblBoard.push(<tr key={y}>{row}</tr>)
    }
    return (
      <div>
      <h1 className={this.state.hasWon ? 'neon-blue' : 'neon-orange'}>{this.state.hasWon ?  'You Won!' : 'Lights Out'}</h1>
      <table className="Board">
        <tbody>
            {tblBoard}

                      {/* 
          this is what fills the array tbleBoard
          <tr key="0">
          <Cell key="0-0" isLit={false} /> 
          <Cell key="0-1" isLit={true} />
          <Cell key="0-2" isLit={true} />
          <Cell key="0-3" isLit={true} />
          <Cell key="0-4" isLit={true} />
          </tr>
          <tr key="1">
          <Cell key="1-0" isLit={true} />
          <Cell key="1-1" isLit={true} />
          <Cell key="1-2" isLit={true} />
          <Cell key="1-3" isLit={true} />
          <Cell key="1-4" isLit={true} />
          </tr>
          <tr key="2">
          <Cell key="2-0" isLit={true} />
          <Cell key="2-1" isLit={true} />
          <Cell key="2-2" isLit={true} />
          <Cell key="2-3" isLit={true} />
          <Cell key="2-4" isLit={true} /> 
        </tr> */}
        </tbody>
      </table>
      {this.state.hasWon ? <div>
                              <h1 className='neon-blue'>Play Again?</h1>
                              <button className='reset'>Reset</button>
                            </div> : ''}
      </div>
    )
  }
}


export default Board;
