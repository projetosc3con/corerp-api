// src/routes/servicos.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { Servico } from '../interfaces/Servico';

const router = Router();

const collection = admin.firestore().collection('servicos');

// Criar servico
router.post('/', authenticate, authorize('servicos.create'), async (req, res) => {
  const data = req.body as Servico;
  if (!data.nome || !data.duracaoMedia || !data.diaSemana || !data.horarios) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const ref = await collection.add(data);
    res.status(201).json({ message: 'Serviço criado com sucesso', id: ref.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar serviço', details: error });
  }
});

// Listar serviços (publico)
router.get('/', async (req, res) => {
  try {
    const snapshot = await collection.get();
    const servicos: Servico[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Servico, 'id'>),
        }));
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar serviços', details: error });
  }
});

//get by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviço', details: error });
  }
});

// Atualizar servico
router.put('/:id', authenticate, authorize('servicos.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Servico>;
  try {
    await collection.doc(id).update(data);
    res.json({ message: 'Serviço atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar serviço', details: error });
  }
});

// Deletar servico
router.delete('/:id', authenticate, authorize('servicos.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.json({ message: 'Serviço deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar serviço', details: error });
  }
});

export default router;