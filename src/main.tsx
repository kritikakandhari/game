import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from '@/auth/AuthProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Root element 'root' not found in index.html");

  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (e: any) {
  console.error("CRITICAL STARTUP ERROR:", e);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace; background: #333; height: 100vh;">
      <h1>CRITICAL APP CRASH</h1>
      <h2>Startup Failed</h2>
      <pre>${e?.message || e}</pre>
      <pre>${e?.stack || ''}</pre>
    </div>
  `;
}
