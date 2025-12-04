import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});