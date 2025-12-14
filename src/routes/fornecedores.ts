// src/routes/fornecedores.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { Fornecedor } from '../interfaces/Fornecedor';

const router = Router();

const collection = admin.firestore().collection('fornecedores');

// Criar fornecedor
router.post('/', authenticate, authorize('fornecedores.create'), async (req, res) => {
  const data = req.body as Fornecedor;
  if (!data.cnpj || !data.nomeFantasia || !data.emailContato) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const ref = await collection.add(data);
    res.status(201).json({ message: 'Fornecedor criado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar fornecedor', details: error });
  }
});

// Listar fornecedores
router.get('/', async (req, res) => {
  try {
    const snapshot = await collection.get();
    const fornecedores: Fornecedor[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Fornecedor, 'id'>),
        }));
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar fornecedores', details: error });
  }
});

// Atualizar categoria
router.put('/:id', authenticate, authorize('fornecedores.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Fornecedor>;
  try {
    await collection.doc(id).update(data);
    res.json({ message: 'Fornecedor atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar fornecedor', details: error });
  }
});

// Deletar categoria
router.delete('/:id', authenticate, authorize('fornecedores.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: 'Fornecedor deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar fornecedor', details: error });
  }
});

export default router;