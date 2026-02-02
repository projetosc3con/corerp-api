// src/routes/agendamentos.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { Agendamento } from '../interfaces/Agendamento';

const router = Router();

const collection = admin.firestore().collection('agendamentos');

// Criar agendamento (publico)
router.post('/', async (req, res) => {
  const data = req.body as Agendamento;
  if (!data.dia || !data.horario || !data.cliente) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const ref = await collection.add(data);
    res.status(201).json({ message: 'Agendamento criado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar agendamento', details: error });
  }
});

// Listar agendamentos
router.get('/', authenticate, authorize('agenda.read'), async (req, res) => {
  try {
    const snapshot = await collection.get();
    const agendamentos: Agendamento[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Agendamento, 'id'>),
        }));
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar agendamentos', details: error });
  }
});

router.get('/cliente/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const snapshot = await collection.where('cliente', '==', id).get();
        const agendamentos: Agendamento[] = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...(doc.data() as Omit<Agendamento, 'id'>),
                }));
            res.json(agendamentos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar agendamentos', details: error });
    }
});

// Buscar agendamento por ID (publica)
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

// Atualizar agendamento
router.put('/:id', authenticate, authorize('agenda.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Agendamento>;
  try {
    await collection.doc(id).update(data);
    res.json({ message: 'Agendamento atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar agendamento', details: error });
  }
});

// Deletar agendamento
router.delete('/:id', authenticate, authorize('agenda.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar agendamento', details: error });
  }
});

export default router;