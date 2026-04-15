import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';
import { Produto } from '../interfaces/Produto';

const router = Router();

// Criar produto
router.post('/', authenticate, authorize('estoque.create'), async (req, res) => {
  const data = req.body as Produto;
  if (!data.barCode || !data.descricao || !data.categoria || !data.fornecedor) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const { data: ref, error } = await supabase.from('estoque').insert(data).select().single();
    if (error) throw error;
    res.status(201).json({ message: 'Produto criado com sucesso', id: ref.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar produto', details: error });
  }
});

// Listar produtos (publico)
router.get('/', async (req, res) => {
  try {
    const { data: produtos, error } = await supabase.from('estoque').select('*');
    if (error) throw error;
    res.json(produtos || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos', details: error });
  }
});

//get by id
router.get('/:id', authenticate, authorize('estoque.read'), async (req, res) => {
  const { id } = req.params;
  try {
    const { data: doc, error } = await supabase.from('estoque').select('*').eq('id', id).single();
    if (error || !doc) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto', details: error });
  }
});

// Atualizar produto
router.put('/:id', authenticate, authorize('estoque.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Produto>;
  try {
    const { error } = await supabase.from('estoque').update(data).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar produto', details: error });
  }
});

// Deletar produto
router.delete('/:id', authenticate, authorize('estoque.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('estoque').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar produto', details: error });
  }
});

export default router;
