import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';
import { Funcionario } from '../interfaces/Funcionario';

const router = Router();

// Criar funcionário
router.post('/', authenticate, authorize('funcionarios.create'), async (req, res) => {
  const data = req.body as Funcionario;
  if (!data.nome || !data.cpf || !data.email || !data.perfil) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const { error } = await supabase.from('funcionarios').insert(data);
    if (error) throw error;
    res.status(201).json({ message: 'Funcionário criado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar funcionário', details: error });
  }
});

// Listar funcionários
router.get('/', authenticate, authorize('funcionarios.read'), async (_req, res) => {
  try {
    const { data: funcionarios, error } = await supabase.from('funcionarios').select('*');
    if (error) throw error;
    res.json(funcionarios || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar funcionários', details: error });
  }
});

// Buscar funcionário por ID
router.get('/:id', authenticate, authorize('funcionarios.read'), async (req, res) => {
  const { id } = req.params;
  try {
    // using id instead of uid per interfaces rewrite
    const { data: doc, error } = await supabase.from('funcionarios').select('*').eq('id', id).single();
    if (error || !doc) return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionário', details: error });
  }
});

// Atualizar funcionário
router.put('/:id', authenticate, authorize('funcionarios.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Funcionario>;
  try {
    const { error } = await supabase.from('funcionarios').update(data).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Funcionário atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar funcionário', details: error });
  }
});

// Deletar funcionário
router.delete('/:id', authenticate, authorize('funcionarios.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('funcionarios').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Funcionário deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar funcionário', details: error });
  }
});

export default router;
