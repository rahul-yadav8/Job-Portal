import ReactDOM from 'react-dom/client'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import { BrowserRouter } from 'react-router-dom'
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the Data Grid
import '@/index.css'
import '@/assets/css/datePicker.css'

import App from './App'
import { SidebarCollapseProvider } from './templates/SidebarCollapseContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <SidebarCollapseProvider>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <LanguageProvider defaultLanguage='en' storageKey='vite-ui-language'>
          <App />
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </SidebarCollapseProvider>
  </BrowserRouter>
)
