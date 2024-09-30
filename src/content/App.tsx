import { useState } from 'react'
import Modal from '../components/Modal'

const App = () => {
  const [open, setOpen] = useState(true);
  return <Modal open={open} onClose={() => setOpen(false)}>
    <div className="omnix-text-red-500">Hello, OmniX</div>
  </Modal>
}

export default App
