export const corsOptions = {
  origin: [
    'https://zync-ashy.vercel.app',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://localhost:5173',
    'https://next-auth-rust-nine.vercel.app'
  ], // Allow both local and production frontends
  credentials: true, // Allow cookies and authorization headers
  sameSite: 'lax'
}
