// src/routes/categorias.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { Categoria } from '../interfaces/Categoria';

const router = Router();

const collection = admin.firestore().collection('categorias');

// Criar categoria
router.post('/', authenticate, authorize('categorias.create'), async (req, res) => {
  const data = req.body as Categoria;
  if (!data.nome || !data.descricao || !data.icone) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const ref = await collection.add(data);
    res.status(201).json({ message: 'Categoria criada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar categoria', details: error });
  }
});

// Listar categorias (publica)
router.get('/', async (req, res) => {
  try {
    const snapshot = await collection.get();
    const categorias: Categoria[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Categoria, 'id'>),
        }));
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar categorias', details: error });
  }
});

// Buscar categoria por ID (publica)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categoria', details: error });
  }
});

// Atualizar categoria
router.put('/:id', authenticate, authorize('categorias.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Categoria>;
  try {
    await collection.doc(id).update(data);
    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar categoria', details: error });
  }
});

// Deletar categoria
router.delete('/:id', authenticate, authorize('categorias.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar categoria', details: error });
  }
});

export default router;