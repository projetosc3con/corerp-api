import { admin } from '../firebase';

async function createInitialAdmin() {
  const email = 'victor@hugo.com';
  const password = '12345678';
  const displayName = 'Admin Inicial';

  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Define a role manual no customClaims (temporariamente)
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });

    console.log(`Usuário criado: ${user.uid} (${email})`);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  }
}

createInitialAdmin();
