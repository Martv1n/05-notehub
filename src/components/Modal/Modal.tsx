import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import css from './Modal.module.css'

interface ModalProps {
  children: React.ReactNode
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const content = (
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={css.modal}>{children}</div>
    </div>
  )

  const el = document.getElementById('modal-root') || document.body
  return ReactDOM.createPortal(content, el)
}

export default Modal
