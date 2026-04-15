import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';
import { Fornecedor } from '../interfaces/Fornecedor';

const router = Router();

// Criar fornecedor
router.post('/', authenticate, authorize('fornecedores.create'), async (req, res) => {
  const data = req.body as Fornecedor;
  if (!data.cnpj || !data.nomeFantasia || !data.emailContato) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const { error } = await supabase.from('Fornecedores').insert(data);
    if (error) throw error;
    res.status(201).json({ message: 'Fornecedor criado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar fornecedor', details: error });
  }
});

// Listar fornecedores
router.get('/', async (req, res) => {
  try {
    const { data: fornecedores, error } = await supabase.from('Fornecedores').select('*');
    if (error) throw error;
    res.json(fornecedores || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar fornecedores', details: error });
  }
});

//get by id
router.get('/:id', authenticate, authorize('fornecedores.read'), async (req, res) => {
  const { id } = req.params;
  try {
    const { data: doc, error } = await supabase.from('Fornecedores').select('*').eq('id', id).single();
    if (error || !doc) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fornecedor', details: error });
  }
});

// Atualizar fornecedor
router.put('/:id', authenticate, authorize('fornecedores.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Fornecedor>;
  try {
    const { error } = await supabase.from('Fornecedores').update(data).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Fornecedor atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar fornecedor', details: error });
  }
});

// Deletar fornecedor
router.delete('/:id', authenticate, authorize('fornecedores.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('Fornecedores').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Fornecedor deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar fornecedor', details: error });
  }
});

export default router;
