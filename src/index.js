import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props){
      return (
        <button className={"square "+ (props.isWinning? "highlighted": null)}
        onClick = {props.onClick}
        
        >
          {props.value}
        </button>
      );
    }
  class Board extends React.Component {
    renderSquare(i) {
      console.log(this.props);
      return (<Square 
        value = {this.props.squares[i]}
        onClick = {()=>{this.props.onClick(i)}}
        key = {"square" + i}
       isWinning = {this.props.winningSquares.includes(i)}
        />
        );
    }
    createRows(){
      const index = [0,3,6];
      const rows = index.map((element, index)=>{
        return(
          <div key = {index} className = "board-row">
            {this.renderSquare(element)}
            {this.renderSquare(element+1)}
            {this.renderSquare(element+2)}
          </div>
        )
      })
      return rows;
    }    
    render() {
      return (
        <div>
          {this.createRows()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        XisNext: true,
        stepNumber: 0,
        MovePositions: [],
        boldButtons :  Array(10).fill(false),
        ascendingButton: true  
      };
    }
    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const MovePositions = this.state.MovePositions.slice();
      const latestPosition = moveLocation(i);
      MovePositions.push(latestPosition);
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = this.state.XisNext ? 'X':'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        XisNext: !this.state.XisNext,
        stepNumber: history.length,
        MovePositions: MovePositions,     
      });

    }
     boldButton(event,index){
       const moveItems = this.state.boldButtons.map((element)=>{
         element = false;
         return element;
       });
      moveItems[index] = true;
      this.setState({
        boldButtons: moveItems
      })
      
    }
    jumpTo(step){
      this.setState({
        stepNumber: step,
        XisNext: step % 2 === 0,
      });
    }
    moveListOrdering(){
      this.setState({
       ascendingButton: !this.state.ascendingButton
      })
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      let winner = calculateWinner(current.squares);
      const MovePositions = this.state.MovePositions;
      const moveItems = this.state.boldButtons.slice();
      const moves = history.map((step, move)=> {
        const desc = move ?
        'Go to move #'+ move + ' '+ MovePositions[move - 1] :
        'Go to the game start';
        if(moveItems[move]){
          return(
            <li key = {move}>
              <button style = {{fontWeight: 1000}} onClick = {(e)=>{this.jumpTo(move);
                                      this.boldButton(e,move)}}>{desc}</button>
            </li>
          )
        }else{
          return(
            <li key = {move}>
              <button onClick = {(e)=>{this.jumpTo(move);
                                      this.boldButton(e, move)}}>{desc}</button>
            </li>
          )
        }
        }
      )
      let status;
      if(winner){
        var winning = winner;
        winner = winner.player;
        status = 'Winner: '+ winner;

      }else{
        status = 'Next move: '+ (this.state.XisNext ? 'X':'O');
        if(!current.squares.includes(null)){
          status = "Draw"
        }
      }
      if(this.state.ascendingButton){
      return (
        <div className="game">
          <div className="game-board">
            <Board
            squares = {current.squares} 
            onClick = {(i)=>{this.handleClick(i)}}
            winningSquares = {winner ? winning.line : []}
             />

          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <div><button onClick = {()=>{this.moveListOrdering()}}>Ascending:ON</button></div>
          </div>
        </div>
      );
    }else{
      return (
        <div className="game">
          <div className="game-board">
            <Board
            squares = {current.squares} 
            onClick = {(i)=>{this.handleClick(i)}}
            winningSquares = {winner ? winning.line:[]}
            />

          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{reverseMoves(moves)}</ol>
            <div><button onClick = {()=>{this.moveListOrdering()}}>Descending: ON</button></div>
          </div>
        </div>
      );

    }
  }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for(let i = 0; i < lines.length;i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {player:squares[a],
              line: [a,b,c]}
    }

  }
  return null;
}
function moveLocation(i){
  switch(i){
    case 0:
      return '(1,1)';
    case 1:
      return '(1,2)';
    case 2:
      return '(1,3)';
    case 3:
      return '(2,1)';
    case 4:
      return '(2,2)';
    case 5:
      return '(2,3)';
    case 6:
      return '(3,1)';
      
    case 7:
      return '(3,2)';
      
    case 8:
      return '(3,3)';
      default:
        return '';
  }
}
function reverseMoves (moves){
  const movesReverse = [];
  for(let i = moves.length - 1 ; i >= 0 ; i--){
    movesReverse.push(moves[i]);
  }
  return movesReverse;
}
function calculateWinnertoHighlight(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for(let i = 0; i < lines.length;i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return lines[i]
    }

  }
  return null;
}
