import { Router } from 'express';
import { Cliente } from '../interfaces/Cliente';
import { admin } from '../firebase';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente', details: error });
  }
});

// Listar clientes
router.get('/', authenticate, authorize('clientes.read'), async (req, res) => {
  try {
    const snapshot = await collection.get();
    const clientes: Cliente[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Cliente, 'id'>),
        }));
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar clientes', details: error });
  }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Cliente>;
  try {
    await collection.doc(id).update(data);
    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar cliente', details: error });
  }
});

// Deletar produto
router.delete('/:id', authenticate, authorize('clientes.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar cliente', details: error });
  }
});

export default router;