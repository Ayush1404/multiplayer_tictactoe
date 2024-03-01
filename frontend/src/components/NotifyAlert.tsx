import {useEffect } from 'react';
import './NotifyAlert.css';

type NotifyAlertProps = {
  open: boolean,
  message: string,
  onClose: () => void,
  setNotifyAlertOpen:React.Dispatch<React.SetStateAction<boolean>>
}

export default function NotifyAlert({ open, message, onClose ,setNotifyAlertOpen}: NotifyAlertProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if(open)setNotifyAlertOpen(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

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
