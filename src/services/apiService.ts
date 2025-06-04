
const API_BASE_URL = 'http://localhost:5208/api';

export interface GeneratePhotoRequest {
  ModelName: string | null;
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
  imageUrl: string;
}

export interface TrainModelResponse {
  success: boolean;
  message?: string;
  modelId?: string;
}

// 1. API to check if user has model or not
export const checkUserModelAvailable = async (userId?: string, modelName?: string | null): Promise<CheckUserModelResponse> => {
  try {
    console.log('apiService.checkUserModelAvailable called with:');
    console.log('  - userId:', userId);
    console.log('  - modelName:', modelName);
    console.log('  - modelName type:', typeof modelName);
    
    if (!userId) {
      console.log('apiService - No userId provided, returning error');
      return {
        hasModel: false,
        success: false,
        message: 'User ID is required'
      };
    }
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Build query parameter correctly
    console.log(modelName)
    let queryParam;
    if (modelName === null || modelName === undefined) {
      queryParam = 'modelName=null';
      console.log('apiService - modelName is null/undefined, setting queryParam to:', queryParam);
    } else {
      queryParam = `modelName=${modelName}`;
      console.log('apiService - modelName has value, setting queryParam to:', queryParam);
    }
    
    const fullUrl = `${API_BASE_URL}/integration/check-user-model-available?${queryParam}`;
    console.log('apiService - Full API URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: headers
    });
    
    console.log('apiService - Response status:', response.status);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('apiService - Response data (200):', data);
      return {
        hasModel: true,
        modelName: modelName || userId,
        success: true,
        message: 'User model found successfully'
      };
    } else if (response.status === 404) {
      const data = await response.json();
      console.log('apiService - Response data (404):', data);
      return {
        hasModel: false,
        success: false,
        message: data.message || 'Model not found'
      };
    } else {
      console.log('apiService - Unexpected response status:', response.status);
      return {
        hasModel: false,
        success: false,
        message: 'Failed to check user model availability'
      };
    }
  } catch (error) {
    console.error('apiService - Error checking user model:', error);
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
    console.log('Generating photo with request:', request);
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Set ModelName to null if using user's own model
    const requestBody = {
      ModelName: request.ModelName === 'user-model' ? null : request.ModelName,
      Prompt: request.Prompt
    };
    
    const response = await fetch(`${API_BASE_URL}/integration/generate-photo`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.isSuccess) {
        // Convert base64 to data URL for display
        const base64Image = data.data.base64Image;
        const outputFormat = data.data.outputFormat || 'jpg';
        const imageUrl = `data:image/${outputFormat};base64,${base64Image}`;
        
        return {
          imageUrl: imageUrl,
          success: true,
          message: data.message || 'Image generated successfully'
        };
      } else {
        return {
          imageUrl: '',
          success: false,
          message: data.message || 'Failed to generate photo'
        };
      }
    } else {
      return {
        imageUrl: '',
        success: false,
        message: `Generation failed with status: ${response.status}`
      };
    }
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
    console.log('Initiating Azure AD login...');
    
    // Simulate Azure AD login process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      token: 'dummy-azure-ad-token-' + Date.now(),
      message: 'Successfully logged in with Azure AD'
    };
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
    console.log('Uploading zip file:', zipFile.name, 'for model:', modelId);
    
    const token = getAuthToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const formData = new FormData();
    formData.append('file', zipFile);
    console.log("here");
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      
      if (data.isSuccess) {
        return {
          url: data.data,
          success: true,
          message: data.message || 'Zip file uploaded successfully'
        };
      } else {
        return {
          url: '',
          success: false,
          message: data.message || 'Upload failed'
        };
      }
    } else {
      return {
        url: '',
        success: false,
        message: `Upload failed with status: ${response.status}`
      };
    }
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
    console.log('Starting model training with request:', request);
    
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/integration/train-model`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.isSuccess) {
        return {
          success: true,
          message: data.message || 'Model training started successfully',
          modelId: data.data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Training failed to start'
        };
      }
    } else {
      return {
        success: false,
        message: `Training failed with status: ${response.status}`
      };
    }
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
  localStorage.setItem('authToken', token);
  console.log('Auth token set:', token);
};

// Helper function to get authorization token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};
