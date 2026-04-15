import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';
import { Agendamento } from '../interfaces/Agendamento';

const router = Router();

// Criar agendamento (publico)
router.post('/', async (req, res) => {
  const data = req.body as Agendamento;
  if (!data.dia || !data.horario || !data.cliente) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const { data: ref, error } = await supabase.from('agendamentos').insert(data).select().single();
    if (error) throw error;
    res.status(201).json({ message: 'Agendamento criado com sucesso', id: ref.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar agendamento', details: error });
  }
});

// Listar agendamentos
router.get('/', authenticate, authorize('agenda.read'), async (req, res) => {
  try {
    const { data: agendamentos, error } = await supabase.from('agendamentos').select('*');
    if (error) throw error;
    res.json(agendamentos || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar agendamentos', details: error });
  }
});

router.get('/cliente/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const { data: agendamentos, error } = await supabase.from('agendamentos').select('*').eq('cliente', id);
        if (error) throw error;
        res.json(agendamentos || []);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar agendamentos', details: error });
    }
});

// Buscar agendamento por ID (publica)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: doc, error } = await supabase.from('agendamentos').select('*').eq('id', id).single();
    if (error || !doc) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamento', details: error });
  }
});

// Atualizar agendamento
router.put('/:id', authenticate, authorize('agenda.update'), async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Agendamento>;
  try {
    const { error } = await supabase.from('agendamentos').update(data).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Agendamento atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar agendamento', details: error });
  }
});

// Deletar agendamento
router.delete('/:id', authenticate, authorize('agenda.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('agendamentos').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar agendamento', details: error });
  }
});

export default router;
