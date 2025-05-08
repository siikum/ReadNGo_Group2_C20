import api from '@/api/AxiosInstance';

// Define interfaces for user-related data
export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}
export interface CreateOrderData {
    userId: number;
    bookIds: number[];
}

export interface AddBook {
    id: number;
    title: string;
    author: string;
    genre: string;
    language: string;
    format: string;
    publisher: string;
    publicationDate: string; // Changed from Date to string
    price: number;
    isOnSale: boolean;
    discountPercentage: number;
    discountStartDate: string; // Changed from Date to string
    discountEndDate: string;   // Added missing field and using string
    description: string;
    isbn: string;
    stockQuantity: number;
    averageRating: number;
    reviewCount: number;
}


export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}



// User registration
export const registerUser = async (userData: RegisterData): Promise<ApiResponse<string>> => {
    try {
        const response = await api.post('/api/User/register', userData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Registration failed'
        };
    }
};

// User login
export const loginUser = async (credentials: LoginData): Promise<ApiResponse<{ token: string }>> => {
    try {
        const response = await api.post('/api/User/login', credentials);
        // Store the token in localStorage for later use
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Login failed'
        };
    }
};

// Get user profile
export const getUserProfile = async (userId: number): Promise<ApiResponse<any>> => {
    try {
        const response = await api.get(`/api/User/profile/${userId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch profile'
        };
    }
};

// Get claim code
export const getClaimCode = async (orderId: number): Promise<ApiResponse<string>> => {
    try {
        const response = await api.get(`/api/User/claim-code/${orderId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Failed to get claim code'
        };
    }
};

export const createOrder = async (orderData: CreateOrderData): Promise<ApiResponse<any>> => {
    try {
        const response = await api.post('/api/Order/create', orderData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Order creation failed'
        };
    }
};

export const addBooks = async (bookData: AddBook): Promise<ApiResponse<any>> => {
    try {
        const response = await api.post('/api/Admin/add-book', bookData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Book creation failed'
        };
    }
};

export const editBook = async (bookId: number, bookData: AddBook): Promise<ApiResponse<any>> => {
    try {
        const response = await api.put(`/api/Admin/edit-book/${bookId}`, bookData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Book update failed'
        };
    }
};


export const deleteBook = async (bookId: number): Promise<ApiResponse<any>> => {
    try {
        const response = await api.delete(`/api/Admin/delete-book/${bookId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Book deletion failed'
        };
    }
};


// Update the getBooks function to use GET method without parameters
export const getBooks = async (): Promise<ApiResponse<any[]>> => {
    try {
        const response = await api.get('/api/Book/all');
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch books'
        };
    }
};


export const booksFilter = async (queryParams: string = ""): Promise<ApiResponse<any[]>> => {
    try {
        // Build the URL with query parameters
        const url = `/api/Book/filter${queryParams ? `?${queryParams}` : ''}`;
        const response = await api.get(url);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch filtered books'
        };
    }
};

export const booksSearchByTitle = async (query: string): Promise<ApiResponse<any[]>> => {
    try {
        // Use the correct endpoint for search with query parameter
        const url = `/api/Book/search?query=${encodeURIComponent(query)}`;
        const response = await api.get(url);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'Failed to search books'
        };
    }
};