// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface RegisterRequest {
  email: string;
  password: string;
  ownerName: string;
  nik: string;
  businessName: string;
  profile?: {
    ownerAddress?: string;
    businessAddress?: string;
    kbli?: string;
    sector?: string;
    scale?: string;
    capital?: string;
    npwp?: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    email: string;
    displayName: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Register user baru ke backend
 */
export const registerUser = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Jika error dengan message khusus, throw error dengan message tersebut
      if (data.message === 'EMAIL_RESERVED_FOR_ADMIN') {
        throw new Error('EMAIL_RESERVED_FOR_ADMIN');
      }
      throw new Error(data.message || 'Registrasi gagal');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Terjadi kesalahan saat menghubungi server');
  }
};

/**
 * Login user
 */
export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login gagal');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Terjadi kesalahan saat menghubungi server');
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return data;
  } catch (error) {
    console.error('Fetch users error:', error);
    return { success: false, data: [] };
  }
};

export const updateUser = async (id: string, payload: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete user');
    return data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

interface SubmissionPayload {
  type: string;
  data: any;
}

export const createSubmission = async (token: string, payload: SubmissionPayload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create submission');
    return data;
  } catch (error) {
    console.error('Create submission error:', error);
    throw error;
  }
};

export const fetchSubmissions = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch submissions');
    return data;
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return { success: false, data: [] };
  }
};

export const updateSubmissionStatus = async (token: string, id: number, status: 'approved' | 'rejected') => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update submission status');
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubmissionById = async (token: string, id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // The original code had more robust error handling here.
    // Keeping the user's requested change for this function.
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Gagal mengambil detail pengajuan' };
  }
};

export const uploadFile = async (token: string, fileUri: string, fileType: string, fileName: string) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: fileType,
    } as any);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Gagal mengunggah file' };
  }
};
export const updateUserProfile = async (token: string, payload: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchMyHistory = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/my-history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch history');
    return data;
  } catch (error) {
    console.error('Fetch history error:', error);
    return { success: false, data: [] };
  }
};
