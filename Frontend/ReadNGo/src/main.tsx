// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "@/components/ui/sonner"
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
        <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={5000}
        />
    </StrictMode>,
)