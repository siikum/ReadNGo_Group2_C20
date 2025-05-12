// Fixed getCart function in apiConfig.ts
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
    publicationDate: string;
    price: number;
    isOnSale: boolean;
    discountPercentage: number;
    discountStartDate: string;
    discountEndDate: string;
    description: string;
    isbn: string;
    stockQuantity: number;
}

interface DiscountPayload {
    percentage: number;
    isOnSale: boolean;
    startDate: string;
    endDate: string;
}

export interface ProcessClaimData {
    claimCode: string;
    membershipId: string;
}

export interface Book {
    bookId: number;
    quantity: number;
}

export interface ClaimCodeResponse {
    message: string;
    orderId?: number;
    membershipId?: string;
    totalAmount?: number;
    books?: Book[];
}

export interface AddToCartData {
    userId: number;
    bookId: number;
    quantity: number;
}

export interface CartItem {
    bookId: number;
    title: string;
    author: string;
    price: number;
    quantity: number;
    totalPrice: number;
}

export interface CartResponse {
    user: {
        id: number;
        fullName: string;
        email: string;
    };
    cartItems: CartItem[];
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
interface LoginResponse {
    token: string;
    userId: number;
    email: string;
    role: string;
    fullName: string;
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
    startTime: string;
    endTime: string;
}

export interface ProcessedOrdersResponse {
    orderId: number;
    userName: string;
    claimCode: string;
    bookCount: number;
    finalAmount: number;
    orderDate: string;
    isConfirmed: boolean;
    isCancelled: boolean;
}

export interface StaffDashboardResponse {
    pendingOrdersCount: number;
    processedOrdersCount: number;
    totalOrders: number;
    pendingOrdersValue: number;
    processedOrdersValue: number;
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
export const loginUser = async (credentials: LoginData): Promise<ApiResponse<LoginResponse>> => {
    // where LoginResponse is:
   

    // Rest of your function remains the same
    try {
        const response = await api.post('/api/User/login', credentials);

        // Store the token and userId in localStorage
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId.toString());
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('userName', response.data.fullName);
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

// This function is used to place an order with the current cart items
export const placeOrder = async (): Promise<ApiResponse<{ claimCode: string; orderId: number }>> => {
    try {
        // Get current user ID from localStorage or context
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await api.post('/api/Order/place', { userId: parseInt(userId) });
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to place order'
        };
    }
};

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

export const addToCart = async (cartData: AddToCartData): Promise<ApiResponse<any>> => {
    try {
        console.log('Adding to cart with data:', cartData); // Add logging to check the data
        const response = await api.post('/api/Cart/add', cartData);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to add to cart'
        };
    }
};

// Fixed getCart function with correct endpoint
export const getCart = async (userId: number): Promise<ApiResponse<CartResponse>> => {
    try {
        const response = await api.get(`/api/Cart/${userId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch cart'
        };
    }
};

export const processClaimCode = async (
    claimData: ProcessClaimData
): Promise<ApiResponse<ClaimCodeResponse>> => {
    try {
        const response = await api.post('/api/Staff/process-claim', claimData);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to process claim code'
        };
    }
};

export const processedOrders = async (): Promise<ApiResponse<ProcessedOrdersResponse[]>> => {
    try {
        const response = await api.get('/api/Staff/orders/processed');
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch processed orders'
        };
    }
};

export const dashboard = async (): Promise<ApiResponse<StaffDashboardResponse>> => {
    try {
        const response = await api.get('/api/Staff/dashboard');
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch dashboard data'
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