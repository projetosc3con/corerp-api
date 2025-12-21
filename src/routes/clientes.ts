import { Router } from 'express';
import { Cliente } from '../interfaces/Cliente';
import { admin } from '../firebase';

const router = Router();

const collection = admin.firestore().collection('clientes');

router.post('/', async (req, res) => {
  try {
    const {
      id,
      nome,
      cpf,
      dataNascimento,
      telefone,
      email,
      endereco,
      observacoes
    } = req.body;

    if (!nome || !cpf || !email ) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    const novoCliente: Cliente = {
      id,
      nome,
      cpf,
      dataNascimento: dataNascimento ?? '',
      telefone: telefone ?? '',
      email,
      endereco: endereco ?? '',
      observacoes: observacoes ?? ''
    };

    await collection.doc(email).set(novoCliente);

    return res.status(201).json({ message: 'Cliente cadastrado com sucesso!', cliente: novoCliente });
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    return res.status(500).json({ error: 'Erro interno ao cadastrar cliente.' });
  }
});

export default router;