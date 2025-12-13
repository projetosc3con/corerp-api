// src/routes/funcionarios.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { Funcionario } from '../interfaces/Funcionario';

const router = Router();

const collection = admin.firestore().collection('funcionarios');

// Criar funcionário
router.post('/', authenticate, authorize('funcionarios.create'), async (req, res) => {
  const data = req.body as Funcionario;
  if (!data.nome || !data.cpf || !data.email || !data.perfil) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const docRef = await collection.add(data);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar funcionário', details: error });
  }
});

// Listar funcionários
router.get('/', authenticate, authorize('funcionarios.read'), async (_req, res) => {
  try {
    const snapshot = await collection.get();
    const funcionarios = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    })) as Funcionario[];
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar funcionários', details: error });
  }
});

// Buscar funcionário por ID
router.get('/:uid', authenticate, authorize('funcionarios.read'), async (req, res) => {
  const { uid } = req.params;
  try {
    const doc = await collection.doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json({ uid: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionário', details: error });
  }
});

// Atualizar funcionário
router.put('/:uid', authenticate, authorize('funcionarios.update'), async (req, res) => {
  const { uid } = req.params;
  const data = req.body as Partial<Funcionario>;
  try {
    await collection.doc(uid).update(data);
    res.json({ message: 'Funcionário atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar funcionário', details: error });
  }
});

// Deletar funcionário
router.delete('/:uid', authenticate, authorize('funcionarios.delete'), async (req, res) => {
  const { uid } = req.params;
  try {
    await collection.doc(uid).delete();
    res.json({ message: 'Funcionário deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar funcionário', details: error });
  }
});

export default router;