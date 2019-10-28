import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square コンポーネントは制御されたコンポーネント (controlled component) になった
// 関数コンポーネントに書き換え = render メソッドだけを有して自分の state を持たないコンポーネントを、よりシンプルに書くための方法
function Square(props) {
  // Board から value と onClick を受け取る
  return (
    // マス目がクリックされたら Board の this.props.onClick(i) を呼び出す
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// Board(親) >>> Square(子)
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        // Game から受け取った squares と onClick を、１つ１つの Square に渡す
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} /* クリックされたタイミングで i に番号が代入される */
      />
    );
  }

  render() {
    return (
      // 以下の renderSquare(i) から i が渡されている
      <div>
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

// Game(親) >>> Board(子)
class Game extends React.Component {
  // ゲームの状態を各 Board の代わりに親の Game コンポーネントで保持する
  constructor(props) {
    super(props);
    // state は状態を表す
    this.state = {
      history: [{
        // 9 個のマス目に対応する 9 個の null 値をセット
        squares: Array(9).fill(null),
      }],
      // どちらのプレイヤーの手番なのかを決める値をセット
      xIsNext: true,
    };
  }

  handleClick(i) {
    // const(定数)で定義しても配列の値は変更できる
    // squares を直接変更する代わりに、.slice() を呼んで配列のコピーを作成している
    // なぜ？ => 複雑な機能が簡単に実装できる・変更の検出・React の再レンダータイミングの決定
    const history = this.state.history; /* 全履歴 */
    const current = history[history.length - 1]; /* 最新の履歴 */
    const squares = current.squares.slice(); /* 最新の盤面をコピー */
    // ゲームの決着が既についている場合やクリックされたマス目が既に埋まっている場合に return を返す
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // i にはクリックしたマス目の番号が渡されている
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares, /* 最新の盤面の配列を履歴の配列(history)の末尾に結合 */
      }]),
      // プレイヤーを交代するため真偽値を反転させる
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history; /* 全履歴 */
    const current = history[history.length - 1]; /* 最新の履歴 */
    const winner = calculateWinner(current.squares); /* 最新の勝敗の判定 */

    let status; /* state と違うので注意 */
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // Board に props を渡す
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares} /* 最新の盤面 */
            // Square が Game の state を更新できるようにする必要がある
            // state はそれを定義しているコンポーネント内でプライベートなものだから、
            // Square から Game の state を直接書き換えることはできない
            // 代わりに、Game から Board を経由して Square に関数を渡すことにして、
            // マス目がクリックされた時に Square にその関数を呼んでもらうようにしましょう
            onClick={(i) => this.handleClick(i)}
           />
        </div>
        <div className="game-info">
          <div>{status}</div>
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

// いずれかのプレーヤが勝利したかどうかを判定する
// 勝負が決まっていない場合は null を返す
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
