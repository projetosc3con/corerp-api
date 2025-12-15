// src/routes/produtos.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { admin } from '../firebase';
import { MarketLanding } from '../interfaces/MarketLanding';

const router = Router();

const collection = admin.firestore().collection('marketplace');

// Obter dados marketplace
router.get('/landing', async (req, res) => {
  try {
    const doc = await collection.doc('config').get()
    const data = doc.data() as MarketLanding;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar marketplace', details: error });
  }
});

// Atualizar marketplace
router.put('/landing', authenticate, authorize('marketplace.update'), async (req, res) => {
  const data = req.body as Partial<MarketLanding>;
  try {
    await collection.doc('config').update(data);
    res.json({ message: 'Marketplace atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar', details: error });
  }
});

export default router;