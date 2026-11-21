import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  NextOrObserver,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export function mapAuthError(errorCode: string): string {
  switch (errorCode) {
    // MASVS: Não revelar se o e-mail existe ou se apenas a senha está errada
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'E-mail ou senha não conferem. Confira e tente novamente.';
    case 'auth/invalid-email':
      return 'Esse e-mail não parece válido.';
    case 'auth/email-already-in-use':
      return 'Não foi possível concluir o cadastro com este e-mail.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 8 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas seguidas. Aguarde alguns instantes e tente novamente.';
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet. Verifique sua rede.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      return credential.user;
    } catch (error: any) {
      throw new Error(mapAuthError(error?.code ?? ''));
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return credential.user;
    } catch (error: any) {
      throw new Error(mapAuthError(error?.code ?? ''));
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: any) {
      // MASVS: Se o usuário não existir, não disparamos erro para não permitir enumeração de contas
      if (error?.code === 'auth/user-not-found') {
        return;
      }
      throw new Error(mapAuthError(error?.code ?? ''));
    }
  },

  subscribeToAuthChanges(callback: NextOrObserver<User>) {
    return onAuthStateChanged(auth, callback);
  },
};