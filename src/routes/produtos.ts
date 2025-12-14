// src/routes/produtos.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { Produto } from '../interfaces/Produto';

const router = Router();

const collection = admin.firestore().collection('estoque');

// Criar produto
router.post('/', authenticate, authorize('estoque.create'), async (req, res) => {
  const data = req.body as Produto;
  if (!data.barCode || !data.descricao || !data.categoria || !data.fornecedor) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const ref = await collection.add(data);
    res.status(201).json({ message: 'Produto criado com sucesso', id: ref.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar produto', details: error });
  }
});

// Listar produtos (publico)
router.get('/', async (req, res) => {
  try {
    const snapshot = await collection.get();
    const produtos: Produto[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Produto, 'id'>),
        }));
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos', details: error });
  }
});

//get by id
router.get('/:id', authenticate, authorize('estoque.read'), async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto', details: error });
  }
});

// Atualizar produto
router.put('/:id', authenticate, authorize('estoque.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Produto>;
  try {
    await collection.doc(id).update(data);
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar produto', details: error });
  }
});

// Deletar fornecedor
router.delete('/:id', authenticate, authorize('estoque.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar produto', details: error });
  }
});

export default router;