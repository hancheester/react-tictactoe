class Square extends React.Component {
    render() {
        return (
            React.createElement(
                'button', 
                {className: 'square' + (this.props.hasWon ? ' won' : ''), onClick: () => this.props.onClick()}, 
                this.props.value)
        );
    }
}

class Board extends React.Component {
    renderSquare(i, hasWon) {
        return (
            React.createElement(
                Square, 
                {
                    key: i,
                    hasWon: hasWon,
                    value: this.props.squares[i], 
                    onClick: () => this.props.onClick(i)
                })
        );
    }

    matchWinningNumbers(i) {
        if (this.props.winningNumbers) {
            for(let k = 0; k < this.props.winningNumbers.length; k++) {
                if (this.props.winningNumbers[k] === i) {
                    return true;
                }
            }
        } 
        
        return false;
    }

    render() {
        var rows = [];
        for (let i = 0; i < 3; i++) {
            var cols = [];
            for(let j = (i * 3); j < ((i * 3) + 3); j++) {
                cols.push(this.renderSquare(j, this.matchWinningNumbers(j)));    
            }

            rows.push(React.createElement(
                'div',
                {key: i, className: 'board-row'},
                cols));
        }

        return React.createElement('div', null, rows);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                key: 0,
                squares: Array(9).fill(null),
                xy: Array(2).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            selectedStepNumber: 0
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];        
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                key: history.length,
                squares: squares,
                xy: calculateXY(i)
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            selectedStepNumber: step
        });
    }

    buildMoves(history) {
        var moves = history.map((step, move) => {
            const desc = step.xy[0] && step.xy[1] ? 'Go to move #' + step.key + ' (' + step.xy[0] + ',' + step.xy[1] + ')' : 'Go to game start';
            const selectedStepNumber = this.state.selectedStepNumber;

            return (
                React.createElement(
                    'li', 
                    {key: move},
                    React.createElement(
                        'button', 
                        {
                            onClick:() => this.jumpTo(move),
                            className: selectedStepNumber !== 0 && selectedStepNumber == move ? 'selected': null
                        }, 
                        desc))
            );
        });

        return moves;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];        
        const winner = calculateWinner(current.squares);
        let moves = this.buildMoves(history);

        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else if (this.state.history.length === 10) {
            status = 'Draw';
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            React.createElement(
                'div',
                {className: 'game'},
                React.createElement(
                    'div',
                    {className:'game-board'},
                    React.createElement(
                        Board, 
                        {
                            squares: current.squares, 
                            winningNumbers: winner ? winner : null,
                            onClick: (i) => this.handleClick(i)
                        })
                ),
                React.createElement(
                    'div',
                    {className: 'game-info'},
                    React.createElement('div', null, status),
                    React.createElement('ol', null, moves),
                    React.createElement(
                        'button', 
                        {
                            onClick: () => {
                                var reversedHistory = toggleReverse(history.slice());
                                this.setState({
                                    history: reversedHistory
                                });
                            }
                        }, 
                        'Sort')
                )
            )
        );
    }
}

ReactDOM.render(
    React.createElement(Game, null),
    document.getElementById('root')
)

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
        return [a, b, c];
      }
    }
    return null;
}

function calculateXY(i) {
    switch(i) {
        case 0: return [1, 1];
        case 1: return [2, 1];
        case 2: return [3, 1];
        case 3: return [1, 2];
        case 4: return [2, 2];
        case 5: return [3, 2];
        case 6: return [1, 3];
        case 7: return [2, 3];
        case 8: return [3, 3];
        default: return null;
    }
}

function toggleReverse(history) {
    var right = 0;
    var left = 0;
    var length = history.length;

    for(left = 0; left < length / 2; left++)
    {
        right = length - left - 1;
        var temp = history[left];
        history[left] = history[right];
        history[right] = temp;
    }
    return history;
}
