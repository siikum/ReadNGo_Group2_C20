﻿// Fixed getCart function in apiConfig.ts
import api from '@/api/AxiosInstance';

// Define interfaces for user-related data
export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

export interface ReviewData {
    userId: number;
    bookId: number;
    comment: string;
    rating: number;
}

export interface ReviewResponse {
    id: number;
    bookId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
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
    category: string;        // Added this field
    arrivalDate: string;     // Added this field
    price: number;
    isOnSale: boolean;
    discountPercentage: number;
    discountStartDate: string;
    discountEndDate: string;
    description: string;
    isbn: string;
    stockQuantity: number;
}

interface RemoveCartPayload {
    userId: number;
    bookId: number;
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
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Registration failed'
        };
    }
};

// User login
export const loginUser = async (credentials: LoginData): Promise<ApiResponse<LoginResponse>> => {
    console.log(credentials, "Credentials");

    try {
        const response = await api.post("/api/User/login", credentials);
        console.log(response, "response from login");

        // Check if response and response.data exist
        if (response && response.data) {
            // Safely store values in localStorage with null checks
            if (response.data.token) localStorage.setItem("token", response.data.token);
            if (response.data.userId) localStorage.setItem("userId", response.data.userId.toString());
            if (response.data.role) localStorage.setItem("userRole", response.data.role);
            if (response.data.email) localStorage.setItem("userEmail", response.data.email);
            if (response.data.fullName) localStorage.setItem("userName", response.data.fullName);

            return {
                success: true,
                data: response.data,
            };
        } else {
            // Handle case where response or response.data is undefined
            return {
                success: false,
                error: "Invalid response data",
            };
        }
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error.response?.data || "Login failed",
        };
    }
};

export const loginStaff = async (credentials: StaffLoginData): Promise<ApiResponse<StaffLoginResponse>> => {
    try {
        const response = await api.post('/api/StaffAuth/login', credentials);

        // Check if response and response.data exist
        if (response && response.data && response.data.token) {
            // Store the token and user details in localStorage
            localStorage.setItem('staffToken', response.data.token);
            localStorage.setItem('token', response.data.token); // Also store as regular token for consistency
            localStorage.setItem('staffRole', response.data.role);
            localStorage.setItem('userRole', response.data.role); // Also store as userRole for consistency
            localStorage.setItem('staffEmail', response.data.email);
            localStorage.setItem('userEmail', response.data.email); // Also store as userEmail for consistency
            localStorage.setItem('staffName', response.data.fullName);
            localStorage.setItem('userName', response.data.fullName); // Also store as userName for consistency
            localStorage.setItem('userId', response.data.userId?.toString() || '0'); // Add userId if available

            return {
                success: true,
                data: response.data
            };
        } else {
            return {
                success: false,
                error: "Invalid response data"
            };
        }
    } catch (error: any) {
        console.error("Staff login error:", error);
        return {
            success: false,
            error: error.response?.data?.message || 'Staff login failed'
        };
    }
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists
};

// Add a helper function to check user type
export const getUserType = (): 'Admin' | 'Staff' | 'Member' | null => {
    const role = localStorage.getItem('userRole');
    if (role === 'Admin' || role === 'Staff' || role === 'Member') {
        return role as 'Admin' | 'Staff' | 'Member';
    }
    return null;
};

// Add a unified logout function that works for all user types
export const logout = () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    // Also clear staff-specific items
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffRole');
    localStorage.removeItem('staffEmail');
    localStorage.removeItem('staffName');
};

// Get user profile
export const getUserProfile = async (userId: number): Promise<ApiResponse<any>> => {
    try {
        const response = await api.get(`/api/User/profile/${userId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
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
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to get claim code'
        };
    }
};

// Enhanced createOrder function for apiConfig.ts

export const createOrder = async (
    orderData: CreateOrderData
): Promise<ApiResponse<any>> => {
    try {
        // Add detailed logging
        console.log('📦 Creating order with data:', JSON.stringify(orderData));

        // Validate orderData
        if (!orderData.userId || !orderData.bookIds || orderData.bookIds.length === 0) {
            console.error('❌ Invalid order data:', orderData);
            return {
                success: false,
                error: 'Invalid order data: missing userId or bookIds',
            };
        }

        // Get the auth token
        const token = localStorage.getItem('token');
        console.log('🔑 Auth token exists:', !!token);

        // Make the API call with proper headers
        const response = await api.post('/api/Order/create', orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        console.log('✅ Order creation successful, response:', response.data);

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        // Enhanced error logging
        console.error('❌ Order creation failed:', error);

        let errorMsg = 'Order creation failed';

        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
        }

        if (typeof error === 'object' && error !== null && 'response' in error) {
            const axiosError = error as any;
            console.error('Response status:', axiosError.response?.status);
            console.error('Response data:', axiosError.response?.data);
            errorMsg = axiosError.response?.data || errorMsg;
        }

        return {
            success: false,
            error: errorMsg,
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

        // Format dates to ISO string for backend compatibility
        formData.append("PublicationDate", new Date(bookData.publicationDate).toISOString());
        formData.append("Category", bookData.category);
        formData.append("ArrivalDate", new Date(bookData.arrivalDate).toISOString());

        formData.append("Price", bookData.price.toString());
        formData.append("IsOnSale", bookData.isOnSale.toString());
        formData.append("DiscountPercentage", bookData.discountPercentage.toString());

        // Only append discount dates if the book is on sale
        if (bookData.isOnSale) {
            formData.append("DiscountStartDate", new Date(bookData.discountStartDate).toISOString());
            formData.append("DiscountEndDate", new Date(bookData.discountEndDate).toISOString());
        }

        formData.append("Description", bookData.description);
        formData.append("ISBN", bookData.isbn);
        formData.append("StockQuantity", bookData.stockQuantity.toString());

        // Append image file
        formData.append("Image", imageFile);

        // Log the FormData contents for debugging
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

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
        console.error('Error adding book:', error);
        console.error('Error response:', error.response?.data);
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

        // Format dates to ISO string for backend compatibility
        formData.append("PublicationDate", new Date(bookData.publicationDate).toISOString());
        formData.append("Category", bookData.category);
        formData.append("ArrivalDate", new Date(bookData.arrivalDate).toISOString());

        formData.append("Price", bookData.price.toString());
        formData.append("IsOnSale", bookData.isOnSale.toString());
        formData.append("DiscountPercentage", bookData.discountPercentage.toString());

        // Format discount dates to ISO string if they exist and book is on sale
        if (bookData.isOnSale && bookData.discountStartDate && bookData.discountEndDate) {
            formData.append("DiscountStartDate", new Date(bookData.discountStartDate).toISOString());
            formData.append("DiscountEndDate", new Date(bookData.discountEndDate).toISOString());
        }

        formData.append("Description", bookData.description);
        formData.append("ISBN", bookData.isbn);
        formData.append("StockQuantity", bookData.stockQuantity.toString());

        if (imageFile) {
            formData.append("Image", imageFile);
        }

        // Log the FormData contents for debugging
        console.log('Edit book FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
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
        console.error('Error editing book:', error);
        console.error('Error response:', error.response?.data);
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
    } catch (error: any) {
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
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch books'
        };
    }
};

export const cancelOrder = async (orderId: number): Promise<ApiResponse<string>> => {
    try {
        console.log(`Cancelling order ${orderId}...`);

        const response = await api.post(`/api/Order/cancel/${orderId}`);

        console.log('Cancel order response:', response.data);

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error cancelling order:', error);

        return {
            success: false,
            error: error.response?.data || 'Failed to cancel order'
        };
    }
};


export const booksFilter = async (queryParams: any = {}): Promise<ApiResponse<any[]>> => {
    try {
        // Build query string from object
        const params = new URLSearchParams();

        // Add each parameter if it exists
        if (queryParams.category) params.append('category', queryParams.category);
        if (queryParams.genre) params.append('genre', queryParams.genre);
        if (queryParams.author) params.append('author', queryParams.author);
        if (queryParams.format) params.append('format', queryParams.format);
        if (queryParams.language) params.append('language', queryParams.language);
        if (queryParams.publisher) params.append('publisher', queryParams.publisher);
        if (queryParams.availableInLibrary !== undefined) params.append('availableInLibrary', queryParams.availableInLibrary.toString());
        if (queryParams.minPrice !== undefined) params.append('minPrice', queryParams.minPrice.toString());
        if (queryParams.maxPrice !== undefined) params.append('maxPrice', queryParams.maxPrice.toString());
        if (queryParams.minRating !== undefined) params.append('minRating', queryParams.minRating.toString());

        const queryString = params.toString();
        const url = `/api/Book/filter${queryString ? `?${queryString}` : ''}`;

        console.log('Filter URL:', url);  // Debug log

        const response = await api.get(url);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Filter error:', error);
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch filtered books'
        };
    }
};

export const booksSearchByTitle = async (query: string): Promise<ApiResponse<any[]>> => {
    try {
       
        const url = `/api/Book/search?query=${encodeURIComponent(query)}`;
        console.log('Search URL:', url);
        console.log('Search query:', query);

        const response = await api.get(url);
        console.log('Search response:', response);
        console.log('Search response data:', response.data);

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Search API error:', error);
        console.error('Search error response:', error.response);
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
        console.log('Adding to cart with data:', cartData); 
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


export const deleteFromCart = async (userId: number, bookId: number): Promise<ApiResponse<any>> => {
    try {
        
        const response = await api.delete('/api/Cart/remove', {
            params: {
                userId: userId,
                bookId: bookId
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error removing item from cart:', error);
        return {
            success: false,
            error: error.response?.data || 'Failed to remove item from cart'
        };
    }
};



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

export const getOrder = async (userId: number): Promise<ApiResponse<CartResponse>> => {
    try {
        const response = await api.get(`/api/Order/user/${userId}`);
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

export const getOrderStatus = async (orderId: number): Promise<ApiResponse<{ isConfirmed: boolean, isCancelled: boolean }>> => {
    try {
        const response = await api.get(`/api/Order/status/${orderId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch order status'
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

// logout function
export const logoutStaff = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffRole');
    localStorage.removeItem('staffEmail');
    localStorage.removeItem('staffName');
};

export const getDistinctAuthors = async (): Promise<ApiResponse<string[]>> => {
    try {
        const response = await api.get('/api/Book/authors');
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch authors'
        };
    }
};

export const getDistinctGenres = async (): Promise<ApiResponse<string[]>> => {
    try {
        const response = await api.get('/api/Book/genres');
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch genres'
        };
    }
};
export const getDistinctLanguages = async (): Promise<ApiResponse<string[]>> => {
    try {
        const response = await api.get('/api/Book/languages');
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch languages'
        };
    }
};

export const getDistinctFormats = async (): Promise<ApiResponse<string[]>> => {
    try {
        const response = await api.get('/api/Book/formats');
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch formats'
        };
    }
};

export interface AddToWishlistData {
    userId: number;
    bookId: number;
}

// Add to wishlist function
export const addToWishlist = async (wishlistData: AddToWishlistData): Promise<ApiResponse<any>> => {
    try {
        console.log('Adding to wishlist with data:', wishlistData);

        const response = await api.post('/api/Wishlist/add', wishlistData);

        console.log('Add to wishlist response:', response.data);

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error adding to wishlist:', error);

        return {
            success: false,
            error: error.response?.data || 'Failed to add to wishlist'
        };
    }
};

// Remove from wishlist function
export const removeFromWishlist = async (userId: number, bookId: number): Promise<ApiResponse<any>> => {
    try {
        console.log(`Removing book ${bookId} from wishlist for user ${userId}`);

        // Use the correct path format: /api/Wishlist/remove/{userId}/{bookId}
        const response = await api.delete(`/api/Wishlist/remove/${userId}/${bookId}`);

        console.log('Remove from wishlist response:', response.data);

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error removing from wishlist:', error);

        return {
            success: false,
            error: error.response?.data || 'Failed to remove from wishlist'
        };
    }
};

// Get user's wishlist
export const getWishlist = async (userId: number): Promise<ApiResponse<any[]>> => {
    try {
        console.log(`Getting wishlist for user ${userId}`);

        const response = await api.get(`/api/Wishlist/${userId}`);

        console.log('Get wishlist response:', response.data);

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error getting wishlist:', error);

        return {
            success: false,
            error: error.response?.data || 'Failed to get wishlist'
        };
    }
};

export const addBookReview = async (reviewData: ReviewData): Promise<ApiResponse<ReviewResponse>> => {
    try {
        const token = localStorage.getItem('token');

        // Use the correct endpoint: /api/Review/add
        const response = await api.post('/api/Review/add', reviewData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error adding review:', error);
        return {
            success: false,
            error: error.response?.data || 'Failed to add review'
        };
    }
};

// Function to get reviews for a book
export const getBookReviews = async (bookId: number): Promise<ApiResponse<ReviewResponse[]>> => {
    try {
        // Use the correct endpoint: /api/Review/book/{bookId}
        const response = await api.get(`/api/Review/book/${bookId}`);

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error fetching reviews:', error);
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch reviews'
        };
    }
};

// Function to check if user can review a book (has purchased it)
export const canUserReviewBook = async (bookId: number): Promise<ApiResponse<boolean>> => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            return {
                success: false,
                error: 'User not authenticated'
            };
        }

        // Assuming there is an endpoint that checks if a user can review (has purchased)
        // If you don't have this specific endpoint, you can check using order history
        const response = await api.get(`/api/Review/can-review/${bookId}/${userId}`);

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error checking review eligibility:', error);

        return {
            success: true,
            data: true // Default to allowing reviews, and check purchase status elsewhere
        };
    }
};

export const getAnnouncements = async (): Promise<ApiResponse<any[]>> => {
    try {
        const response = await api.get('/api/User/announcements');
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error fetching announcements:', error);
        return {
            success: false,
            error: error.response?.data || 'Failed to fetch announcements'
        };
    }
};

export const hasUserReviewedBook = async (bookId: number): Promise<ApiResponse<boolean>> => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            return {
                success: false,
                error: 'User not authenticated'
            };
        }

        const response = await api.get(`/api/Review/has-reviewed/${bookId}/${userId}`);

        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error checking if user reviewed book:', error);

        // Fallback approach: fetch all reviews for the book and check if user has reviewed
        try {
            const reviewsResponse = await getBookReviews(bookId);
            if (reviewsResponse.success && reviewsResponse.data) {
                const userReviewed = reviewsResponse.data.some(
                    review => review.userId === parseInt(userId as string)
                );
                return {
                    success: true,
                    data: userReviewed
                };
            }
        } catch (err) {
            console.error('Fallback check failed:', err);
        }

        return {
            success: false,
            error: 'Failed to check user review status'
        };
    }
};


