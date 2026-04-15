import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { supabase } from '../supabase';
import { MarketLanding, AboutUs, Contact } from '../interfaces/MarketLanding';
import { Categoria } from '../interfaces/Categoria';
import { Servico } from '../interfaces/Servico';

const router = Router();

// Obter dados marketplace
router.get('/landing', async (req, res) => {
  try {
    const { data, error: mError } = await supabase.from('MarketLandings').select('*').eq('id', 'config').single();
    
    const { data: cData, error: cError } = await supabase.from('Categorias').select('*');
    const { data: sData, error: sError } = await supabase.from('Servicos').select('*');
    
    if (mError || cError || sError) throw new Error('Error loading marketplace data');
    
    res.json({ ...data, categorias: cData, servicos: sData });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar marketplace', details: error });
  }
});

// Atualizar marketplace
router.put('/landing', authenticate, authorize('marketplace.update'), async (req, res) => {
  const data = req.body as Partial<MarketLanding>;
  try {
    const { error } = await supabase.from('MarketLandings').update(data).eq('id', 'config');
    if (error) throw error;
    res.json({ message: 'Marketplace atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar', details: error });
  }
});

//Obter dados sobre
router.get('/about', async (req, res) => {
  try {
    const { data, error } = await supabase.from('MarketLandings').select('*').eq('id', 'about').single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar marketplace', details: error });
  }
});

router.put('/about', authenticate, authorize('marketplace.update'), async (req, res) => {
  const data = req.body as Partial<AboutUs>;
  try {
    const { error } = await supabase.from('MarketLandings').update(data).eq('id', 'about');
    if (error) throw error;
    res.json({ message: 'Marketplace atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar', details: error });
  }
});

//Obter dados contato
router.get('/contact', async (req, res) => {
  try {
    const { data, error } = await supabase.from('MarketLandings').select('*').eq('id', 'contact').single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar marketplace', details: error });
  }
});

router.put('/contact', authenticate, authorize('marketplace.update'), async (req, res) => {
  const data = req.body as Partial<Contact>;
  try {
    const { error } = await supabase.from('MarketLandings').update(data).eq('id', 'contact');
    if (error) throw error;
    res.json({ message: 'Marketplace atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar', details: error });
  }
});

export default router;
