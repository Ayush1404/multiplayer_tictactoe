export type cellProps={
    handleClick:(index:number)=>{},
    index:number,
    sign:'x'|'O'|' ',
}
const Cell = ({
    handleClick,
    index,
    sign
}:cellProps) => {
    return (
      <button
        color="primary"
        onClick={() => handleClick(index)}
      >{sign}</button>
    );
  };
export default Cell; 