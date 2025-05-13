// @/components/NavBar.tsx
import { ShoppingCart, User, Heart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const { cart, wishlist } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add your logout logic here
        console.log('User logged out');
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-primary hover:text-primary/90">
                    ReadNGo
                </Link>

                <div className="flex items-center gap-4">
                    {/* Wishlist Icon */}
                    <Link to="/wishlist" className="relative">
                        <Button variant="ghost" size="icon">
                            <Heart className="h-5 w-5" />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative">
                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="h-5 w-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Order Details Icon */}
                    <Link to="/order-details" className="relative">
                        <Button variant="ghost" size="icon">
                            <Package className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => navigate('/orders')}
                                className="cursor-pointer"
                            >
                                My Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/order-details')}
                                className="cursor-pointer"
                            >
                                Order Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/wishlist')}
                                className="cursor-pointer"
                            >
                                My Wishlist
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer focus:bg-red-50 focus:text-red-500"
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};