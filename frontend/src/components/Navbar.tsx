
const Navbar = ({userName,connected}:{userName:string,connected:boolean}) => {
  return (
    <>
      {connected && <h1 className="mt-4" style={{marginLeft:'1rem'}}>
        Welcome {userName}
      </h1>}
    </> 
  )
}

export default Navbar