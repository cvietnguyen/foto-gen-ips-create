
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
export const checkUserModelAvailable = async (userId?: string): Promise<CheckUserModelResponse> => {
  try {
    console.log('Checking user model availability for user:', userId);
    
    if (!userId) {
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
    
    const response = await fetch(`${API_BASE_URL}/check-user-model-available?modelName=${userId}`, {
      method: 'GET',
      headers: headers
    });
    
    if (response.status === 200) {
      const data = await response.json();
      return {
        hasModel: true,
        modelName: userId,
        success: true,
        message: 'User model found successfully'
      };
    } else if (response.status === 404) {
      const data = await response.json();
      return {
        hasModel: false,
        success: false,
        message: data.message || 'Model not found'
      };
    } else {
      return {
        hasModel: false,
        success: false,
        message: 'Failed to check user model availability'
      };
    }
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
    console.log('Generating photo with request:', request);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return dummy generated image URL
    const dummyImageUrls = [
      'https://picsum.photos/512/512?random=1',
      'https://picsum.photos/512/512?random=2',
      'https://picsum.photos/512/512?random=3',
      'https://picsum.photos/512/512?random=4',
      'https://picsum.photos/512/512?random=5'
    ];
    
    const randomImageUrl = dummyImageUrls[Math.floor(Math.random() * dummyImageUrls.length)];
    
    return {
      imageUrl: randomImageUrl,
      success: true,
      message: 'Image generated successfully'
    };
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
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return dummy upload success with URL
    const dummyUrl = `https://storage.example.com/uploads/${modelId}/${zipFile.name}`;
    
    return {
      url: dummyUrl,
      success: true,
      message: 'Zip file uploaded successfully'
    };
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
    
    // Simulate training start delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return dummy training success
    const dummyModelId = 'trained-model-' + Date.now();
    
    return {
      success: true,
      message: 'Model training started successfully',
      modelId: dummyModelId
    };
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
