import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline, CssVarsProvider } from '@mui/joy'
import { theme } from './theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <App />
      </CssVarsProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
