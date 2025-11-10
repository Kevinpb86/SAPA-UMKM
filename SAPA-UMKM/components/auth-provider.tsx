import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import {
  type AccountProfile,
  deleteAccountById,
  findAccountByEmail,
  findAccountById,
  listAccounts,
  seedAdminAccount,
  type StoredAccount,
  upsertAccount,
} from '@/lib/auth-store';

export type RegisterPayload = {
  email: string;
  password: string;
  ownerName: string;
  nik: string;
  businessName: string;
  profile?: AccountProfile;
};

export type ManageAccountPayload = {
  id?: string;
  email: string;
  password?: string;
  displayName: string;
  profile?: AccountProfile;
};

export type AuthContextValue = {
  user: StoredAccount | null;
  loading: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<StoredAccount | null>;
  logout: () => Promise<void>;
  accounts: StoredAccount[];
  refreshAccounts: () => Promise<void>;
  createUserAccount: (payload: ManageAccountPayload) => Promise<StoredAccount>;
  updateUserAccount: (payload: ManageAccountPayload) => Promise<StoredAccount>;
  deleteUserAccount: (id: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const ADMIN_ACCOUNT: StoredAccount = {
  id: 'admin-root-account',
  role: 'admin',
  email: 'adminumkm@gmail.com',
  password: 'Admin123',
  displayName: 'Administrator SAPA UMKM',
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<StoredAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);

  const refreshAccounts = useCallback(async () => {
    const list = await listAccounts();
    setAccounts(list);
  }, []);

  useEffect(() => {
    (async () => {
      await seedAdminAccount(ADMIN_ACCOUNT);
      await refreshAccounts();
      setLoading(false);
    })();
  }, [refreshAccounts]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const normalizedEmail = payload.email.trim().toLowerCase();
    if (normalizedEmail === ADMIN_ACCOUNT.email) {
      throw new Error('EMAIL_RESERVED_FOR_ADMIN');
    }
    await upsertAccount({
      id: `user-${normalizedEmail}`,
      role: 'user',
      email: normalizedEmail,
      password: payload.password,
      displayName: payload.ownerName || payload.businessName || normalizedEmail,
      profile: {
        ownerName: payload.ownerName,
        nik: payload.nik,
        businessName: payload.businessName,
        ...payload.profile,
      },
    });
    setUser(null);
    await refreshAccounts();
  }, [refreshAccounts]);

  const login = useCallback(async (email: string, password: string) => {
    const account = await findAccountByEmail(email);
    if (account && account.password === password) {
      setUser(account);
      return account;
    }

    return null;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  const createUserAccount = useCallback(
    async (payload: ManageAccountPayload) => {
      const normalizedEmail = payload.email.trim().toLowerCase();
      if (normalizedEmail === ADMIN_ACCOUNT.email) {
        throw new Error('EMAIL_RESERVED_FOR_ADMIN');
      }
      if (!payload.password || payload.password.length < 6) {
        throw new Error('PASSWORD_REQUIRED');
      }

      const account: StoredAccount = {
        id: payload.id ?? `user-${Date.now()}`,
        role: 'user',
        email: normalizedEmail,
        password: payload.password,
        displayName: payload.displayName || normalizedEmail,
        profile: payload.profile,
      };

      await upsertAccount(account);
      await refreshAccounts();
      return account;
    },
    [refreshAccounts],
  );

  const updateUserAccount = useCallback(
    async (payload: ManageAccountPayload) => {
      if (!payload.id) {
        throw new Error('ACCOUNT_ID_REQUIRED');
      }
      const existing = await findAccountById(payload.id);
      if (!existing) {
        throw new Error('ACCOUNT_NOT_FOUND');
      }
      if (existing.role === 'admin') {
        throw new Error('CANNOT_MUTATE_ADMIN');
      }

      const normalizedEmail = payload.email.trim().toLowerCase();
      if (normalizedEmail === ADMIN_ACCOUNT.email) {
        throw new Error('EMAIL_RESERVED_FOR_ADMIN');
      }

      const updated: StoredAccount = {
        ...existing,
        email: normalizedEmail,
        displayName: payload.displayName || existing.displayName,
        password: payload.password && payload.password.length > 0 ? payload.password : existing.password,
        profile: {
          ...existing.profile,
          ...payload.profile,
        },
      };

      await upsertAccount(updated);
      await refreshAccounts();

      if (user?.id === updated.id) {
        setUser(updated);
      }

      return updated;
    },
    [refreshAccounts, user],
  );

  const deleteUserAccount = useCallback(
    async (id: string) => {
      const target = await findAccountById(id);
      if (!target) {
        throw new Error('ACCOUNT_NOT_FOUND');
      }
      if (target.role === 'admin') {
        throw new Error('CANNOT_REMOVE_ADMIN');
      }

      await deleteAccountById(id);
      await refreshAccounts();

      if (user?.id === id) {
        setUser(null);
      }
    },
    [refreshAccounts, user],
  );

  useEffect(() => {
    if (!loading) {
      refreshAccounts();
    }
  }, [loading, refreshAccounts]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      register,
      login,
      logout,
      accounts,
      refreshAccounts,
      createUserAccount,
      updateUserAccount,
      deleteUserAccount,
    }),
    [
      user,
      loading,
      register,
      login,
      logout,
      accounts,
      refreshAccounts,
      createUserAccount,
      updateUserAccount,
      deleteUserAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
