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
    //averageRating: number;
    //reviewCount: number;
}


interface DiscountPayload {
    percentage: number;
    isOnSale: boolean;
    startDate: string; // ISO string (e.g., "2025-05-09T11:08:36.443Z")
    endDate: string;
}

export interface CreateStaffData {
    fullName: string;
    email: string;
    password: string;
}

export interface StaffLoginData {
    email: string;
    password: string;
}

export interface StaffLoginResponse {
    success: boolean;
    message: string;
    token: string;
    fullName: string;
    email: string;
    role: string;
}

export interface CreateAnnouncementData {
    title: string;
    message: string;
    startTime: string; // ISO format
    endTime: string;
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

//export const addBooks = async (bookData: AddBook): Promise<ApiResponse<any>> => {
//    try {
//        const response = await api.post('/api/Admin/add-book-with-image', bookData);
//        return {
//            success: true,
//            data: response.data
//        };
//    } catch (error) {
//        return {
//            success: false,
//            error: error.response?.data || 'Book creation failed'
//        };
//    }
//};
export const addBooks = async (bookData: AddBook, imageFile: File): Promise<ApiResponse<any>> => {
    try {
        const formData = new FormData();

        // Append text fields
        formData.append("Title", bookData.title);
        formData.append("Author", bookData.author);
        formData.append("Genre", bookData.genre);
        formData.append("Language", bookData.language);
        formData.append("Format", bookData.format);
        formData.append("Publisher", bookData.publisher);
        formData.append("PublicationDate", bookData.publicationDate);
        formData.append("Price", bookData.price.toString());
        formData.append("IsOnSale", bookData.isOnSale.toString());
        formData.append("DiscountPercentage", bookData.discountPercentage.toString());
        formData.append("DiscountStartDate", bookData.discountStartDate);
        formData.append("DiscountEndDate", bookData.discountEndDate);
        formData.append("Description", bookData.description);
        formData.append("ISBN", bookData.isbn);
        formData.append("StockQuantity", bookData.stockQuantity.toString());

        // Optional (if backend accepts or calculates these):
        //formData.append("AverageRating", bookData.averageRating.toString());
        //formData.append("ReviewCount", bookData.reviewCount.toString());

        // Append image file
        formData.append("Image", imageFile);

        const response = await api.post('/api/Admin/add-book-with-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Book creation failed'
        };
    }
};

export const editBook = async (
    bookId: number,
    bookData: AddBook,
    imageFile?: File
): Promise<ApiResponse<any>> => {
    try {
        const formData = new FormData();

        // Append book data
        formData.append("Title", bookData.title);
        formData.append("Author", bookData.author);
        formData.append("Genre", bookData.genre);
        formData.append("Language", bookData.language);
        formData.append("Format", bookData.format);
        formData.append("Publisher", bookData.publisher);
        formData.append("PublicationDate", bookData.publicationDate);
        formData.append("Price", bookData.price.toString());
        formData.append("IsOnSale", bookData.isOnSale.toString());
        formData.append("DiscountPercentage", bookData.discountPercentage.toString());
        formData.append("DiscountStartDate", bookData.discountStartDate);
        formData.append("DiscountEndDate", bookData.discountEndDate);
        formData.append("Description", bookData.description);
        formData.append("ISBN", bookData.isbn);
        formData.append("StockQuantity", bookData.stockQuantity.toString());
        //formData.append("AverageRating", bookData.averageRating.toString());
        //formData.append("ReviewCount", bookData.reviewCount.toString());

        if (imageFile) {
            formData.append("Image", imageFile);
        }

        const response = await api.put(
            `/api/Admin/edit-book-with-image/${bookId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || "Book update failed",
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

export const setDiscount = async (
    bookId: number,
    discountData: DiscountPayload
): Promise<ApiResponse<any>> => {
    try {
        const response = await api.put(`/api/Admin/set-discount/${bookId}`, discountData);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to set discount'
        };
    }
};


export const createStaff = async (staffData: CreateStaffData): Promise<ApiResponse<any>> => {
    try {
        const response = await api.post('/api/Admin/create-staff', staffData);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to create staff'
        };
    }
};

export const adminCreateAnnouncement = async (
    announcementData: CreateAnnouncementData
): Promise<ApiResponse<any>> => {
    try {
        const response = await api.post('/api/Admin/announcement', announcementData);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to create announcement'
        };
    }
};


export const loginStaff = async (credentials: StaffLoginData): Promise<ApiResponse<StaffLoginResponse>> => {
    try {
        const response = await api.post('/api/StaffAuth/login', credentials);

        // Store the token and user details in localStorage
        if (response.data && response.data.token) {
            localStorage.setItem('staffToken', response.data.token);
            localStorage.setItem('staffRole', response.data.role);
            localStorage.setItem('staffEmail', response.data.email);
            localStorage.setItem('staffName', response.data.fullName);
        }

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Staff login failed'
        };
    }
};

// Add a helper function to check if staff is authenticated
export const isStaffAuthenticated = (): boolean => {
    const token = localStorage.getItem('staffToken');
    const role = localStorage.getItem('staffRole');
    return !!(token && role === 'Staff');
};

// Add a helper function to get staff details
export const getStaffDetails = () => {
    return {
        token: localStorage.getItem('staffToken'),
        role: localStorage.getItem('staffRole'),
        email: localStorage.getItem('staffEmail'),
        fullName: localStorage.getItem('staffName')
    };
};

// Add a logout function
export const logoutStaff = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffRole');
    localStorage.removeItem('staffEmail');
    localStorage.removeItem('staffName');
};