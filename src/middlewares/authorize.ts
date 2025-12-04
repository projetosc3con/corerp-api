import { Request, Response, NextFunction } from 'express';
import { admin } from '../firebase';

export function authorize(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) {
      return res.status(403).json({ error: 'Usuário sem role definida' });
    }

    try {
      const roleDoc = await admin.firestore().collection('roles').doc(role).get();
      const roleData = roleDoc.data();

      if (!roleDoc.exists || !roleData?.permissions?.includes(permission)) {
        return res.status(403).json({ error: 'Permissão negada' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar permissões', details: error });
    }
  };
}
