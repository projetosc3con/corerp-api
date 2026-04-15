import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';
import { Pet } from '../interfaces/Pet';

const router = Router();

// Criar pet
router.post('/', authenticate, async (req, res) => {
  const data = req.body as Pet;
  if (!data.nome || !data.idCliente) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const { data: ref, error } = await supabase.from('Pets').insert(data).select().single();
    if (error) throw error;
    res.status(201).json({ message: 'Pet criado com sucesso', id: ref.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar pet', details: error });
  }
});

// Listar pets (do usuário)
router.get('/cliente/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const { data: pets, error } = await supabase.from('Pets').select('*').eq('idCliente', id);
        if (error) throw error;
        res.json(pets || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pets', details: error });
  }
});

// Buscar pet geral
router.get('/', authenticate, authorize('pets.read'), async (req, res) => {
  try {
    const { data: pets, error } = await supabase.from('Pets').select('*');
    if (error) throw error;
    res.json(pets || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pets', details: error });
  }
});

//get by id
router.get('/:id', authenticate, authorize('pets.read'), async (req, res) => {
  const { id } = req.params;
  try {
    const { data: doc, error } = await supabase.from('Pets').select('*').eq('id', id).single();
    if (error || !doc) return res.status(404).json({ error: 'Pet não encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pet', details: error });
  }
});

// Atualizar pet
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Pet>;
  try {
    const { error } = await supabase.from('Pets').update(data).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Pet atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar pet', details: error });
  }
});

// Deletar pet
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('Pets').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Pet deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar pet', details: error });
  }
});

export default router;
