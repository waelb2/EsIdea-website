import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
function Whiteboard() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw persistenceKey='gueroumi' />
		</div>
	)
}

export default Whiteboard
