import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './lib/firebase.ts'
import {App} from './App.tsx'
import {registerSW} from 'virtual:pwa-register'
import './index.css'

registerSW({immediate: true})

if (window.self !== window.top) {
    document.body.textContent = 'Error: App loaded inside iframe instead of /godot/help_me.html';
} else {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App/>
        </StrictMode>,
    );
}