import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

export function authorize(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const roleId = req.user?.user_metadata?.role || req.user?.app_metadata?.role;
    if (!roleId) {
      return res.status(403).json({ error: 'Usuário sem role definida' });
    }

    try {
      const { data: roleData, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

      if (error || !roleData || !roleData.permissions?.includes(permission)) {
        return res.status(403).json({ error: 'Permissão negada' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar permissões', details: error });
    }
  };
}
