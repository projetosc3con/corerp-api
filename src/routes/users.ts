// src/routes/users.ts
import { Router } from 'express';
import { admin } from '../firebase';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

const firestore = admin.firestore();

// Criar novo usuário
router.post('/', authenticate, authorize('users.create'), async (req, res) => {
  const { email, password, displayName, role } = req.body;

  // URL da imagem de perfil padrão
  const defaultPhotoURL = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

  try {
    if (role) {
      const roleDoc = await firestore.collection('roles').doc(role).get();
      if (!roleDoc.exists) {
        return res.status(400).json({ error: `Role '${role}' não existe.` });
      }
    }

    const user = await admin.auth().createUser({
      email,
      password,
      displayName,
      photoURL: defaultPhotoURL, // <-- adiciona foto padrão
    });

    if (role) {
      await admin.auth().setCustomUserClaims(user.uid, { role });
    }

    res.status(201).json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role
    });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário', details: error });
  }
});


// Listar todos os usuários (limite de 1000)
router.get('/', authenticate, authorize('users.read'), async (req, res) => {
  try {
    const list = await admin.auth().listUsers(1000);
    const users = list.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: u.customClaims?.role || 'user',
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários', details: error });
  }
});

// Buscar usuário por displayName
router.get('/search', authenticate, authorize('users.read'), async (req, res) => {
    const { displayName } = req.query;
    if (!displayName || typeof displayName !== 'string') {
        return res.status(400).json({ error: 'displayName é obrigatório e deve ser uma string' });
    }

    try {
        const list = await admin.auth().listUsers(1000);
        const filtered = list.users.filter((u) =>
            u.displayName?.toLowerCase().includes(displayName.toLowerCase())
        ).map((u) => ({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            role: u.customClaims?.role || 'user',
        }));


        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error });
    }
});

// Atualizar usuário
router.put('/:uid', authenticate, authorize('users.update'), async (req, res) => {
  const { uid } = req.params;
  const { email, password, displayName, role } = req.body;
  try {
    if (role) {
      const roleDoc = await firestore.collection('roles').doc(role).get();
      if (!roleDoc.exists) {
        return res.status(400).json({ error: `Role '${role}' não existe.` });
      }
    }

    await admin.auth().updateUser(uid, { email, password, displayName });
    if (role) {
      await admin.auth().setCustomUserClaims(uid, { role });
    }
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário', details: error });
  }
});

// Deletar usuário
router.delete('/:uid', authenticate, authorize('users.delete'), async (req, res) => {
  const { uid } = req.params;
  try {
    await admin.auth().deleteUser(uid);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar usuário', details: error });
  }
});

export default router;