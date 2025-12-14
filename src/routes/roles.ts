// src/routes/roles.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { Role } from '../interfaces/Role';

const router = Router();

// Criar role
router.post('/', authenticate, authorize('roles.create'), async (req, res) => {
  const { id, name, permissions } = req.body as Role;

  if (!id || !name || !Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Dados inválidos para criação de role.' });
  }

  try {
    const role: Role = { id, name, permissions };
    await admin.firestore().collection('roles').doc(id).set(role);
    res.status(201).json({ message: 'Role criada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar role', details: error });
  }
});

// Listar roles
router.get('/', authenticate, authorize('roles.read'), async (_req, res) => {
  try {
    const snapshot = await admin.firestore().collection('roles').get();
    const roles: Role[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Role, 'id'>),
    }));
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar roles', details: error });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await admin.firestore().collection('roles').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Role não encontrada' });
    }

    const role: Role = {
      id: doc.id,
      ...(doc.data() as Omit<Role, 'id'>),
    };

    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar role', details: error });
  }
});

// Atualizar role
router.put('/:id', authenticate, authorize('roles.update'), async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body as Partial<Role>;

  try {
    await admin.firestore().collection('roles').doc(id).update({ name, permissions });
    res.json({ message: 'Role atualizada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar role', details: error });
  }
});

// Deletar role
router.delete('/:id', authenticate, authorize('roles.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    await admin.firestore().collection('roles').doc(id).delete();
    res.json({ message: 'Role deletada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar role', details: error });
  }
});

export default router;
