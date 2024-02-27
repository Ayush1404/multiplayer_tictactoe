import './ChallengeAlert.css'
type ChallengeAlertProps ={
    open:boolean,
    challenger:string,
    rematchChallenge:boolean,
    onClose:()=>void,
    onAccept:(challenger:string)=>void,
    onDecline:(challenger:string)=>void
}
export default function ChallengeAlert({ open, challenger,rematchChallenge, onClose, onAccept, onDecline }:ChallengeAlertProps) {
  return (
    <div className={`modal ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{`You've been challenged by ${challenger}`}{rematchChallenge&&<span>to a rematch</span>}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn " onClick={() => onAccept(challenger)}>Accept</button>
            <button type="button" className="btn " onClick={() => onDecline(challenger)}>Decline</button>
          </div>
        </div>
      </div>
    </div>
  );
}
