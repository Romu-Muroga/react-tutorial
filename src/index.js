import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square コンポーネントは制御されたコンポーネント (controlled component) になった
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

// Board(親) >>> Square(子)
class Board extends React.Component {
  // ゲームの状態を各 Square の代わりに親の Board コンポーネントで保持する
  constructor(props) {
    super(props);
    this.state = {
      // 9 個のマス目に対応する 9 個の null 値をセット
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    // squares を直接変更する代わりに、.slice() を呼んで配列のコピーを作成している
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    // Square に props を渡す
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
