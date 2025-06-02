const API_BASE_URL = 'http://localhost:5208/api/integration';

export interface GeneratePhotoRequest {
  ModelName: string;
  Prompt: string;
}

export interface GeneratePhotoResponse {
  imageUrl: string;
  success: boolean;
  message?: string;
}

export interface CheckUserModelResponse {
  hasModel: boolean;
  modelName?: string;
  success: boolean;
  message?: string;
}

export interface UploadZipResponse {
  url: string;
  success: boolean;
  message?: string;
}

export interface TrainModelRequest {
  ImageUrl: string;
}

export interface TrainModelResponse {
  success: boolean;
  message?: string;
  modelId?: string;
}

// 1. API to check if user has model or not
export const checkUserModelAvailable = async (): Promise<CheckUserModelResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-user-model-available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking user model:', error);
    return {
      hasModel: false,
      success: false,
      message: 'Failed to check user model availability'
    };
  }
};

// 2. Generate photo from model
export const generatePhoto = async (request: GeneratePhotoRequest): Promise<GeneratePhotoResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating photo:', error);
    return {
      imageUrl: '',
      success: false,
      message: 'Failed to generate photo'
    };
  }
};

// 3. Azure AD login (placeholder - actual implementation would use MSAL or similar)
export const loginWithAzureAD = async (): Promise<{ success: boolean; token?: string; message?: string }> => {
  try {
    // This is a placeholder for Azure AD authentication
    // In a real implementation, you would use Microsoft Authentication Library (MSAL)
    console.log('Initiating Azure AD login...');
    
    // Simulate Azure AD login process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          token: 'dummy-azure-ad-token',
          message: 'Successfully logged in with Azure AD'
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error with Azure AD login:', error);
    return {
      success: false,
      message: 'Failed to login with Azure AD'
    };
  }
};

// 4. Upload zip file
export const uploadZipFile = async (zipFile: File, modelId: string): Promise<UploadZipResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', zipFile);
    formData.append('modelId', modelId);

    const response = await fetch(`${API_BASE_URL}/uploading-zip-file`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        // Add authorization header if needed
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading zip file:', error);
    return {
      url: '',
      success: false,
      message: 'Failed to upload zip file'
    };
  }
};

// 5. Train model
export const trainModel = async (request: TrainModelRequest): Promise<TrainModelResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/train-model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error training model:', error);
    return {
      success: false,
      message: 'Failed to train model'
    };
  }
};

// Helper function to set authorization token for future requests
export const setAuthToken = (token: string) => {
  // Store token in localStorage or sessionStorage
  localStorage.setItem('authToken', token);
};

// Helper function to get authorization token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};
