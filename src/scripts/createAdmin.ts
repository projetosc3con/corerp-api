import { supabase } from '../supabase';

async function createInitialAdmin() {
  const email = 'victor@hugo.com';
  const password = '12345678';
  const displayName = 'Admin Inicial';
  const roleName = 'Administrador do Sistema';
  let roleId: string;

  try {
    // 1. Garantir que a role 'Administrador do Sistema' existe na tabela 'Roles'
    console.log('Verificando existência da Role admin...');
    const { data: roleDoc, error: roleError } = await supabase
      .from('Roles')
      .select('id')
      .eq('name', roleName)
      .maybeSingle();

    if (!roleDoc) {
      console.log('Role admin não encontrada. Criando...');
      // Inserir a role admin com todas as permissões no array
      const { data: insertRole, error: insertRoleError } = await supabase.from('Roles').insert({
        name: roleName,
        permissions: [
          'users.create', 'users.read', 'users.update', 'users.delete',
          'roles.create', 'roles.read', 'roles.update', 'roles.delete',
          'clientes.create', 'clientes.read', 'clientes.update', 'clientes.delete',
          'fornecedores.create', 'fornecedores.read', 'fornecedores.update', 'fornecedores.delete',
          'funcionarios.create', 'funcionarios.read', 'funcionarios.update', 'funcionarios.delete',
          'categorias.create', 'categorias.read', 'categorias.update', 'categorias.delete',
          'estoque.create', 'estoque.read', 'estoque.update', 'estoque.delete',
          'marketplace.update', 'servicos.create', 'servicos.update', 'servicos.delete',
          'pets.read', 'agenda.create', 'agenda.read', 'agenda.update', 'agenda.delete'
        ]
      }).select('id').single();

      if (insertRoleError) {
         console.warn('Falha persistindo role. Erro:', insertRoleError.message);
         return;
      }
      roleId = insertRole.id;
      console.log('Role admin inserida na tabela com sucesso. ID:', roleId);
    } else {
       roleId = roleDoc.id;
       console.log('Role admin já existe. ID:', roleId);
    }

    // 2. Criar ou buscar o usuário no Auth Admin Api com user_metadata
    console.log('Criando/Recuperando usuário admin no Supabase Auth...');
    
    let user: any;
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existingUser = listData?.users.find((u: any) => u.email === email);

    if (existingUser) {
        user = existingUser;
        // Atualiza os metadados do usuario
        await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: {
                displayName,
                role: roleId,
                roleName: roleName
            }
        });
        console.log(`Usuário recuperado e atualizado no Auth com ID: ${user.id} (${email})`);
    } else {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            displayName,
            role: roleId,
            roleName: roleName
          }
        });

        if (authError) throw authError;
        user = authData.user;
        console.log(`Usuário criado no Auth com ID: ${user.id} (${email})`);
    }

    // 3. Criar registro na tabela 'Users'
    const { error: publicUserError } = await supabase.from('Users').upsert({
      uid: user.id, // O nome da coluna na sua tabela é 'uid'
      email: email,
      displayName: displayName,
      role: roleId
    });

    if (publicUserError) {
       console.log(`(Aviso) Não foi possível inserir na tabela pública Users. Motivo: ${publicUserError.message}`);
    } else {
       console.log(`Usuário vinculado e salvo na tabela pública Users com sucesso!`);
    }

    console.log("Processo Finalizado.");
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  }
}

createInitialAdmin();
