import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';

const router = Router();

// Criar novo usuário
router.post('/', authenticate, authorize('users.create'), async (req, res) => {
  const { email, password, displayName, role, photoURL } = req.body;
  try {
    if (role) {
      const { data: roleDoc, error: roleError } = await supabase.from('Roles').select('*').eq('id', role).single();
      if (roleError || !roleDoc) {
        return res.status(400).json({ error: `Role '${role}' não existe.` });
      }
    }

    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { displayName, photoURL, role },
      email_confirm: true
    });

    if (error) throw error;

    res.status(201).json({
      id: user.user.id,
      email: user.user.email,
      displayName: user.user.user_metadata?.displayName,
      photoURL: user.user.user_metadata?.photoURL,
      role
    });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário', details: error });
  }
});

// Listar todos os usuários (limite de 1000)
router.get('/', authenticate, authorize('users.read'), async (req, res) => {
  try {
    const { data: list, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (error) throw error;
    
    const users = list.users.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.user_metadata?.displayName,
      role: u.user_metadata?.role || u.app_metadata?.role || 'cliente',
      photoURL: u.user_metadata?.photoURL
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários', details: error });
  }
});

// Buscar usuário por UID -> Now ID
router.get('/search', authenticate, authorize('users.read'), async (req, res) => {
  // changed variable check to id but query param still id
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'id é obrigatório e deve ser uma string' });
  }

  try {
    const { data: userRecord, error } = await supabase.auth.admin.getUserById(id);
    if (error) throw error;

    const user = {
      id: userRecord.user.id,
      email: userRecord.user.email,
      displayName: userRecord.user.user_metadata?.displayName,
      role: userRecord.user.user_metadata?.role || userRecord.user.app_metadata?.role || 'user',
      photoURL: userRecord.user.user_metadata?.photoURL || null,
    };

    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'Usuário não encontrado', details: error });
  }
});

// Atualizar perfil e UID no cadastro
router.patch('/:id/role', authenticate, async (req, res) => {
    const { role, email } = req.body;
    const { id } = req.params;
    if (!id || !role || !email) {
      return res.status(400).json({ error: 'id, role e email são obrigatórios' });
    }

    try {
      const { data: roleDoc, error: roleError } = await supabase.from('Roles').select('*').eq('id', role).single();
      if (roleError || !roleDoc) {
        return res.status(400).json({ error: `Role '${role}' não existe.` });
      }
      
      const { error: updateAuthError } = await supabase.auth.admin.updateUserById(id, { user_metadata: { role } });
      if (updateAuthError) throw updateAuthError;

      // uid was changed to id in the interfaces/db
      const { error: updateFuncError } = await supabase.from('Funcionarios').update({ id }).eq('email', email);
      if (updateFuncError) throw updateFuncError;
      
      res.json({ message: 'Usuário funcionário atualizado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar funcionário', details: error });
    }
});

// Atualizar usuário
router.put('/:id', authenticate, authorize('users.update'), async (req, res) => {
  const { id } = req.params;
  const { email, password, displayName, role } = req.body;
  try {
    if (role) {
      const { data: roleDoc, error: roleError } = await supabase.from('Roles').select('*').eq('id', role).single();
      if (roleError || !roleDoc) {
        return res.status(400).json({ error: `Role '${role}' não existe.` });
      }
    }

    const updateObj: any = {};
    if (email) updateObj.email = email;
    if (password) updateObj.password = password;
    if (displayName !== undefined || role !== undefined) {
      updateObj.user_metadata = {};
      if (displayName !== undefined) updateObj.user_metadata.displayName = displayName;
      if (role !== undefined) updateObj.user_metadata.role = role;
    }

    const { error } = await supabase.auth.admin.updateUserById(id, updateObj);
    if (error) throw error;
    
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário', details: error });
  }
});

// Deletar usuário
router.delete('/:id', authenticate, authorize('users.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar usuário', details: error });
  }
});

export default router;
