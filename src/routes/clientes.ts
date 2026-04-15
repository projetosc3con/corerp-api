import { Router } from 'express';
import { Cliente } from '../interfaces/Cliente';
import { supabase } from '../supabase';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { id, nome, cpf, dataNascimento, telefone, email, endereco, observacoes } = req.body;

    if (!nome || !cpf || !email ) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    const novoCliente: Cliente = {
      id,
      nome,
      cpf,
      dataNascimento: dataNascimento ?? '',
      telefone: telefone ?? '',
      email,
      endereco: endereco ?? '',
      observacoes: observacoes ?? ''
    };

    // Assuming we use email as id or standard default auto increment.
    // If id logic was setting email as doc ID in firestore, we might need to set it as PK or just insert.
    const { error } = await supabase.from('Clientes').insert(novoCliente);
    if (error) throw error;

    return res.status(201).json({ message: 'Cliente cadastrado com sucesso!', cliente: novoCliente });
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    return res.status(500).json({ error: 'Erro interno ao cadastrar cliente.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: doc, error } = await supabase.from('Clientes').select('*').eq('id', id).single();
    if (error || !doc) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente', details: error });
  }
});

// Listar clientes
router.get('/', authenticate, authorize('clientes.read'), async (req, res) => {
  try {
    const { data: clientes, error } = await supabase.from('Clientes').select('*');
    if (error) throw error;
    res.json(clientes || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar clientes', details: error });
  }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body as Partial<Cliente>;
  try {
    const { error } = await supabase.from('Clientes').update(data).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar cliente', details: error });
  }
});

// Deletar cliente
router.delete('/:id', authenticate, authorize('clientes.delete'), async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('Clientes').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar cliente', details: error });
  }
});

export default router;
