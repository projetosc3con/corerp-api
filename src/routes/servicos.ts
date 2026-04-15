import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';
import { Servico } from '../interfaces/Servico';

const router = Router();

// Criar servico
router.post('/', authenticate, authorize('servicos.create'), async (req, res) => {
  const data = req.body as Servico;
  if (!data.nome || !data.duracaoMedia || !data.diaSemana || !data.horarios) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const { data: ref, error } = await supabase.from('Servicos').insert(data).select().single();
    if (error) throw error;
    res.status(201).json({ message: 'Serviço criado com sucesso', id: ref.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar serviço', details: error });
  }
});

// Listar serviços (publico)
router.get('/', async (req, res) => {
  try {
    const { data: servicos, error } = await supabase.from('Servicos').select('*');
    if (error) throw error;
    res.json(servicos || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar serviços', details: error });
  }
});

//get by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: doc, error } = await supabase.from('Servicos').select('*').eq('id', id).single();
    if (error || !doc) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviço', details: error });
  }
});

// Atualizar servico
router.put('/:id', authenticate, authorize('servicos.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Servico>;
  try {
    const { error } = await supabase.from('Servicos').update(data).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Serviço atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar serviço', details: error });
  }
});

// Deletar servico
router.delete('/:id', authenticate, authorize('servicos.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('Servicos').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Serviço deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar serviço', details: error });
  }
});

export default router;
