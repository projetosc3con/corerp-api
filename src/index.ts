import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authenticate } from './middlewares/authenticate';
import userRoutes from './routes/users';
import roleRoutes from './routes/roles';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas protegidas
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);

// Rota de status
app.get('/', (_req, res) => {
  res.send('🔥 API rodando localmente!');
});

app.listen(port, () => {
  console.log(`✅ Servidor local rodando em http://localhost:${port}`);
});
