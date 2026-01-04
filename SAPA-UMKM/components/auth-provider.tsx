import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { deleteUser as deleteUserAPI, fetchUsers, loginUser as loginUserAPI, registerUser as registerUserAPI, updateUser as updateUserAPI } from '@/lib/api';
import {
  type AccountProfile,
  deleteAccountById,
  findAccountById,
  listAccounts,
  seedAdminAccount,
  type StoredAccount,
  upsertAccount
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
    if (user?.role === 'admin') {
      const response = await fetchUsers();
      if (response.success && Array.isArray(response.data)) {
        const mappedAccounts: StoredAccount[] = response.data.map((u: any) => ({
          id: u.id.toString(),
          role: u.role,
          email: u.email,
          password: '', // Password is not exposed by API
          displayName: u.display_name || u.displayName || u.email,
          profile: {
            ownerName: u.owner_name,
            businessName: u.business_name,
            nik: u.nik,
            sector: u.sector,
            scale: u.scale,
            capital: u.capital,
            kbli: u.kbli,
            ownerAddress: u.owner_address,
            businessAddress: u.business_address,
          },
        }));
        // Ensure admin is in the list (if not returned by API)
        const hasAdmin = mappedAccounts.some(a => a.email === ADMIN_ACCOUNT.email);
        if (!hasAdmin) {
          mappedAccounts.unshift(ADMIN_ACCOUNT);
        }
        setAccounts(mappedAccounts);
        return;
      }
    }
    const list = await listAccounts();
    setAccounts(list);
  }, [user]);

  useEffect(() => {
    (async () => {
      await seedAdminAccount(ADMIN_ACCOUNT);
      await refreshAccounts();
      setLoading(false);
    })();
  }, [refreshAccounts]);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      // Panggil API backend untuk registrasi
      const response = await registerUserAPI({
        email: payload.email,
        password: payload.password,
        ownerName: payload.ownerName,
        nik: payload.nik,
        businessName: payload.businessName,
        profile: payload.profile,
      });

      if (!response.success) {
        throw new Error(response.message || 'Registrasi gagal');
      }

      // Setelah registrasi berhasil, refresh accounts dari local storage
      // (untuk kompatibilitas dengan fitur lain yang masih menggunakan local storage)
      setUser(null);
      await refreshAccounts();
    } catch (error) {
      // Re-throw error untuk ditangani di component
      throw error;
    }
  }, [refreshAccounts]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await loginUserAPI({ email, password });

      if (response.success && response.data) {
        const { user: apiUser, token } = response.data;

        // Map backend snake_case to frontend camelCase
        const account: StoredAccount = {
          id: apiUser.id.toString(),
          role: apiUser.role,
          email: apiUser.email,
          displayName: apiUser.display_name || apiUser.displayName || apiUser.email,
          token: token,
          profile: {
            ownerName: apiUser.owner_name || apiUser.ownerName,
            businessName: apiUser.business_name || apiUser.businessName,
            nik: apiUser.nik,
            // Add other profile fields mapping if necessary
          }
        };

        setUser(account);
        return account;
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
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

      if (user?.role === 'admin') {
        const response = await registerUserAPI({
          email: normalizedEmail,
          password: payload.password,
          ownerName: payload.displayName,
          // Assuming displayName is ownerName, we also need businessName. 
          // If profile.businessName exists use it, else usage displayName.
          businessName: payload.profile?.businessName || payload.displayName,
          nik: payload.profile?.nik || '',
          profile: payload.profile,
        });

        if (response.success && response.data) {
          await refreshAccounts();
          // We return a mock object just to satisfy the return type, 
          // actual data is in the DB.
          return {
            id: response.data.id.toString(),
            email: response.data.email,
            role: 'user',
            displayName: response.data.displayName,
            password: '',
            profile: payload.profile
          } as StoredAccount;
        }
        throw new Error(response.message || 'Gagal membuat user');
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
    [refreshAccounts, user],
  );

  const updateUserAccount = useCallback(
    async (payload: ManageAccountPayload) => {
      if (!payload.id) {
        throw new Error('ACCOUNT_ID_REQUIRED');
      }

      if (user?.role === 'admin') {
        // Call API
        const response = await updateUserAPI(payload.id, payload);
        if (response.success) {
          await refreshAccounts();
          return {
            ...payload,
            role: 'user',
            // return payload fields mixed with response if needed, 
            // for now just returning payload as updated account
            id: payload.id,
            password: '',
            displayName: payload.displayName,
            profile: payload.profile
          } as StoredAccount;
        }
        throw new Error(response.message || 'Gagal update user');
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
      if (user?.role === 'admin') {
        const response = await deleteUserAPI(id);
        if (response.success) {
          await refreshAccounts();
          return;
        }
        throw new Error(response.message || 'Gagal menghapus user');
      }

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
