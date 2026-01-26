// src/routes/categorias.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { Pet } from '../interfaces/Pet';

const router = Router();

const collection = admin.firestore().collection('pets');

// Criar pet
router.post('/', authenticate, async (req, res) => {
  const data = req.body as Pet;
  if (!data.nome || !data.idCliente) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const ref = await collection.add(data);
    res.status(201).json({ message: 'Pet criado com sucesso', id: ref.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar pet', details: error });
  }
});

// Listar pets (do usuário)
router.get('/cliente/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
    const snapshot = await collection.where('idCliente', '==', id).get();
    const pets: Pet[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Pet, 'id'>),
        }));
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pets', details: error });
  }
});

// Buscar pet geral
router.get('/', authenticate, authorize('pets.read'), async (req, res) => {
  try {
    const snapshot = await collection.get();
    const pets: Pet[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Pet, 'id'>),
        }));
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pets', details: error });
  }
});

//get by id
router.get('/:id', authenticate, authorize('pets.read'), async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Pet não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pet', details: error });
  }
});

// Atualizar pet
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Pet>;
  try {
    await collection.doc(id).update(data);
    res.json({ message: 'Pet atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar pet', details: error });
  }
});

// Deletar pet
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: 'Pet deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar pet', details: error });
  }
});

export default router;