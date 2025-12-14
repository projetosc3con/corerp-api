import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import roleRoutes from './routes/roles';
import clientRoutes from './routes/clientes';
import funcionariosRoutes from './routes/funcionarios';
import categoriasRoutes from './routes/categorias';
import fornecedoresRoutes from './routes/fornecedores';
import estoqueRoutes from './routes/produtos';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas protegidas
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/clientes', clientRoutes);
app.use('/funcionarios', funcionariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/fornecedores', fornecedoresRoutes);
app.use('/estoque', estoqueRoutes);

// Rota de status
app.get('/', (_req, res) => {
  res.send('🔥 API rodando localmente!');
});

app.listen(port, () => {
  console.log(`✅ Servidor local rodando em http://localhost:${port}`);
});
