import './NotifyAlert.css'
type NotifyAlertProps ={
    open:boolean,
    message:string,
    onClose:()=>void,
}
export default function NotifyAlert({ open, message, onClose,}:NotifyAlertProps) {
  return (
    <div className={`modal ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{message}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
      </div>
    </div>
  );
}
