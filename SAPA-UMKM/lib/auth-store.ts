import * as FileSystem from 'expo-file-system';

export type AccountRole = 'user' | 'admin';

export type AccountProfile = {
  ownerName?: string;
  nik?: string;
  businessName?: string;
  ownerAddress?: string;
  businessAddress?: string;
  city?: string;
  kbli?: string;
  sector?: string;
  scale?: string;
  capital?: string;
  npwp?: string;
  employees?: string;
  phone?: string;
  contactEmail?: string;
  businessDescription?: string;
  supportNeeds?: string;
};

export type StoredAccount = {
  id: string;
  role: AccountRole;
  email: string;
  password: string;
  displayName: string;
  profile?: AccountProfile;
};

type LegacyStoredUser = {
  email: string;
  password: string;
  ownerName: string;
  nik: string;
  businessName: string;
};

const fsCompat = FileSystem as Partial<
  typeof FileSystem & {
    documentDirectory?: string;
    cacheDirectory?: string;
    EncodingType?: { UTF8: string };
  }
>;

const STORAGE_ROOT = fsCompat.documentDirectory ?? fsCompat.cacheDirectory ?? '';
const ENCODING_UTF8 = fsCompat.EncodingType?.UTF8 ?? 'utf8';

const STORAGE_FILE = `${STORAGE_ROOT}sapa-umkm-auth.json`;

let cachedAccounts: StoredAccount[] | null = null;

const writeAccounts = async (accounts: StoredAccount[]) => {
  cachedAccounts = accounts;

  try {
    await FileSystem.writeAsStringAsync(STORAGE_FILE, JSON.stringify(accounts), {
      encoding: ENCODING_UTF8 as never,
    });
  } catch (error) {
    // Ignore persistence errors — cache still holds data for current session.
  }
};

const readRawAccounts = async (): Promise<StoredAccount[]> => {
  if (cachedAccounts) {
    return cachedAccounts;
  }

  try {
    const content = await FileSystem.readAsStringAsync(STORAGE_FILE, {
      encoding: ENCODING_UTF8 as never,
    });

    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
      cachedAccounts = parsed as StoredAccount[];
      return cachedAccounts;
    }

    if (parsed && Array.isArray(parsed.accounts)) {
      cachedAccounts = parsed.accounts as StoredAccount[];
      return cachedAccounts;
    }

    if (parsed && typeof parsed === 'object' && 'email' in parsed) {
      const legacy = parsed as LegacyStoredUser;
      const migrated: StoredAccount = {
        id: `legacy-${legacy.email}`,
        role: 'user',
        email: legacy.email,
        password: legacy.password,
        displayName: legacy.ownerName ?? legacy.email,
        profile: {
          ownerName: legacy.ownerName,
          nik: legacy.nik,
          businessName: legacy.businessName,
        },
      };
      cachedAccounts = [migrated];
      await writeAccounts(cachedAccounts);
      return cachedAccounts;
    }
  } catch (error) {
    // fall through
  }

  cachedAccounts = cachedAccounts ?? [];
  return cachedAccounts;
};

export const listAccounts = async (): Promise<StoredAccount[]> => {
  const accounts = await readRawAccounts();
  return accounts;
};

export const findAccountByEmail = async (email: string): Promise<StoredAccount | null> => {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = await readRawAccounts();
  return accounts.find(account => account.email === normalizedEmail) ?? null;
};

export const findAccountById = async (id: string): Promise<StoredAccount | null> => {
  const accounts = await readRawAccounts();
  return accounts.find(account => account.id === id) ?? null;
};

export const upsertAccount = async (account: StoredAccount) => {
  const accounts = await readRawAccounts();
  const normalizedEmail = account.email.trim().toLowerCase();
  const filtered = accounts.filter(
    existing => existing.id !== account.id && existing.email !== normalizedEmail,
  );
  const nextAccounts = [...filtered, { ...account, email: normalizedEmail }];
  await writeAccounts(nextAccounts);
};

export const seedAdminAccount = async (adminAccount: StoredAccount) => {
  const accounts = await readRawAccounts();
  const normalizedEmail = adminAccount.email.trim().toLowerCase();
  const filtered = accounts.filter(account => account.email !== normalizedEmail);

  const seededAdmin: StoredAccount = {
    ...adminAccount,
    email: normalizedEmail,
  };

  await writeAccounts([...filtered.filter(account => account.role !== 'admin'), seededAdmin]);
};

export const deleteAccountById = async (id: string) => {
  const accounts = await readRawAccounts();
  const nextAccounts = accounts.filter(account => account.id !== id);
  await writeAccounts(nextAccounts);
};

export const deleteAllAccounts = async () => {
  cachedAccounts = [];
  try {
    await FileSystem.deleteAsync(STORAGE_FILE, { idempotent: true });
  } catch (error) {
    // Ignore failures when cleaning up storage.
  }
};

