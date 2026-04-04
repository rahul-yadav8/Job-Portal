import { AuthProvider, RootRoutes } from './routes'
import { Layout } from '@templates'
import { ChakraProvider } from '@chakra-ui/react'
function App() {
  return (
    <AuthProvider>
      <Layout>
        <ChakraProvider>
          <RootRoutes />
        </ChakraProvider>
      </Layout>
    </AuthProvider>
  )
}

export default App
