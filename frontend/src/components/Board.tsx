import './Board.css'; // Import CSS file for additional styling

type BoardProps = {
  board: Array<string|null>,
  onMove: (index: number) => void
}

const Board = ({ board, onMove }: BoardProps) => {


  return (
    <table className="board table d-flex align-items-center justify-content-center mt-4">
      <tbody>
        <tr className='d-flex'>
          <td className="border border-left border-top cell" onClick={() => onMove(0)}>{board[0]}</td>
          <td className="border border-top cell" onClick={() => onMove(1)}>{board[1]}</td>
          <td className="border border-right border-top cell" onClick={() => onMove(2)}>{board[2]}</td> 
        </tr>
        <tr className='d-flex'>
          <td className="border border-left cell" onClick={() => onMove(3)}>{board[3]}</td>
          <td className="border cell" onClick={() => onMove(4)}>{board[4]}</td>
          <td className="border border-right cell" onClick={() => onMove(5)}>{board[5]}</td>
        </tr>
        <tr className='d-flex'>
          <td className="border border-left border-bottom cell" onClick={() => onMove(6)}>{board[6]}</td>
          <td className="border-bottom cell" onClick={() => onMove(7)}>{board[7]}</td>
          <td className="border border-right border-bottom cell" onClick={() => onMove(8)}>{board[8]}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Board;
