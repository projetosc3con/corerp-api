import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';
import { Categoria } from '../interfaces/Categoria';

const router = Router();

// Criar categoria
router.post('/', authenticate, authorize('categorias.create'), async (req, res) => {
  const data = req.body as Categoria;
  if (!data.nome || !data.descricao || !data.icone) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const { error } = await supabase.from('Categorias').insert(data);
    if (error) throw error;
    res.status(201).json({ message: 'Categoria criada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar categoria', details: error });
  }
});

// Listar categorias (publica)
router.get('/', async (req, res) => {
  try {
    const { data: categorias, error } = await supabase.from('Categorias').select('*');
    if (error) throw error;
    res.json(categorias || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar categorias', details: error });
  }
});

// Buscar categoria por ID (publica)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: doc, error } = await supabase.from('Categorias').select('*').eq('id', id).single();
    if (error || !doc) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categoria', details: error });
  }
});

// Atualizar categoria
router.put('/:id', authenticate, authorize('categorias.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Categoria>;
  try {
    const { error } = await supabase.from('Categorias').update(data).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar categoria', details: error });
  }
});

// Deletar categoria
router.delete('/:id', authenticate, authorize('categorias.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('Categorias').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar categoria', details: error });
  }
});

export default router;
