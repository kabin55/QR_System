import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/Toast';
import { Search, Plus, Minus, ShoppingCart, X, MapPin, Star } from 'lucide-react';

import { fetchMenuByRestaurant, placeOrder } from '../../service/api';
import { callWaiter } from '../../service/api';
import { useToast } from  '../../utils/toastProvider'



export default function QRMenuResponsive() {
  const [menu, setMenu] = useState([]);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [callingWaiter, setCallingWaiter] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [restaurantName, setRestaurantName] = useState('Restaurant');
  const [tableId, setTableId] = useState('unknown');

  const navigate = useNavigate();
  const { showToast } = useToast()


  useEffect(() => {
    const tableNumber = localStorage.getItem('tableNumber');
    if (!tableNumber) return navigate('/');

    setTableId(tableNumber);

    const restData = JSON.parse(localStorage.getItem('restaurantDetails') || '{}');
    setRestaurantName(restData.restaurantName || 'Restaurant');

    const loadMenu = async () => {
      try {
        const data = await fetchMenuByRestaurant(restData.restaurantId,showToast);
        const formattedMenu = data.map(d => ({
          id: d._id,
          name: d.item,
          price: d.price,
          desc: d.type,
          category: d.type || 'Uncategorized',
          image: d.pic || '/food-placeholder.jpg',
        }));
        setMenu(formattedMenu);
      } catch (err) {
        console.error(err);
        setToast({ message: 'Failed to load menu', type: 'error' });
      }
    };

    loadMenu();
  }, [navigate]);

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const cartItems = useMemo(() => {
    return menu
      .filter(item => cart[item.id])
      .map(item => ({ ...item, qty: cart[item.id] }));
  }, [cart, menu]);

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  const filteredMenu = useMemo(() => {
    return menu
      .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
      .filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [menu, selectedCategory, query]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(menu.map(item => item.category));
    return Array.from(cats);
  }, [menu]);

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      setToast({ message: 'Add at least one item', type: 'info' });
      return;
    }

    setSubmitting(true);
    try {
      const restData = JSON.parse(localStorage.getItem('restaurantDetails') || '{}');
      await placeOrder(restData.restaurantId, {
        tableno: tableId,
        items: cartItems.map(({ name, price, qty }) => ({ item: name, price, quantity: qty })),
        subtotal: total,
      });

      setCart({});
      setIsCartOpen(false);
      setToast({ message: 'Order placed successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCallWaiter = async () => {
  setCallingWaiter(true);
  try {
    const restData = JSON.parse(localStorage.getItem('restaurantDetails') || '{}');
    await callWaiter(restData.restaurantId, tableId);
    setCart({});
    setIsCartOpen(false);
    setToast({ message: 'Waiter has been called', type: 'success' });
  } catch (error) {
    setToast({ message: error.message, type: 'error' });
  } finally {
    setCallingWaiter(false);
  }
};
  

  const CategoryFilter = ({ categories, selectedCategory, onSelect }) => (
    <div className="flex gap-2 flex-wrap my-4 px-4 sm:px-0">
      {categories.map((cat, idx) => (
        <button
          key={cat + idx}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === cat
              ? 'bg-indigo-500 text-white'
              : 'bg-[#1d1e22] text-[#d4d4dc] hover:bg-[#393f4d]'
          }`}
        >
          {cat}
        </button>
      ))}
      <button
        onClick={() => onSelect('All')}
        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500 text-white"
      >
        Reset
      </button>
    </div>
  );
  


  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1d1e22', color: '#d4d4dc' }}>
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#393f4d' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="p-4 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <MapPin size={18} />
              <div>
                <h1 className="font-bold">{restaurantName}</h1>
                <p className="text-xs opacity-70">Table: {tableId}</p>
              </div>
            </div>
            <button onClick={() => setIsCartOpen(true)} className="p-3 rounded-full bg-[#1d1e22]">
              <ShoppingCart size={18} />
            </button>
          </div>

          <div className="my-4">
            <div className="flex items-center bg-[#1d1e22] rounded-lg px-3 py-2">
              <Search size={16} className="opacity-60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu..."
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          <CategoryFilter
            categories={['All', ...uniqueCategories]}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </header>
{/* Toast */}
<Toast
  message={toast.message}
  type={toast.type}
  onClose={() => setToast({ message: '', type: 'info' })}
/>

      <main className="w-full min-h-screen px-4 py-4 flex-grow">
        <div className="grid gap-4 grid-cols-2">
          {filteredMenu.map(item => (
            <div key={item.id} className="rounded-xl overflow-hidden shadow-md bg-[#393f4d]">
              <img src={item.image} alt={item.name} className="h-28 w-full object-cover" />
              <div className="p-4 flex flex-col">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <p className="text-xs opacity-70">{item.desc}</p>
                <p className="mt-1 font-bold">Rs. {item.price}</p>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex bg-[#1d1e22] rounded-md overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-2">
                      <Minus size={14} />
                    </button>
                    <div className="px-2 text-sm">{cart[item.id] || 0}</div>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-2">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-3 py-2 rounded-md font-semibold bg-[#d4d4dc] text-[#1d1e22]"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setIsCartOpen(false)} />
          <div className="w-full max-w-md p-4 sm:p-6 overflow-auto" style={{ backgroundColor: '#1d1e22' }}>
            <div className="flex items-center justify-between border-b border-[#393f4d] pb-3">
              <h2 className="text-lg sm:text-xl font-bold">Your Order</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center opacity-70 py-12 text-sm sm:text-base">Cart is empty</div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-md" style={{ backgroundColor: '#393f4d' }}>
                    <div>
                      <div className="font-medium text-sm sm:text-base">{item.name}</div>
                      <div className="text-xs sm:text-sm opacity-70">
                        Rs. {item.price} × {item.qty}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-[#1d1e22] rounded">
                        <Minus size={14} />
                      </button>
                      <div className="px-2 text-sm">{item.qty}</div>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-[#1d1e22] rounded">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-[#393f4d] pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base opacity-80">Subtotal</div>
                <div className="font-semibold text-sm sm:text-base">Rs. {total}</div>
              </div>
              <div className="mt-4 space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full py-3 rounded-md font-semibold disabled:opacity-60 transition"
                  style={{ backgroundColor: '#d4d4dc', color: '#1d1e22' }}
                >
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
                <button
                  onClick={handleCallWaiter}
                  disabled={callingWaiter}
                  className="w-full border border-[#393f4d] py-3 rounded-md font-semibold hover:bg-[#393f4d] transition disabled:opacity-60"
                  style={{ backgroundColor: '#d4d4dc', color: '#1d1e22' }}
                >
                  {callingWaiter ? 'Calling Waiter...' : 'Call Waiter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3 rounded-md font-semibold shadow-lg transition"
            style={{ backgroundColor: '#d4d4dc', color: '#1d1e22' }}
          >
            View Cart ({cartItems.length} items) - Rs. {total}
          </button>
        </div>
      )}

      <footer className="py-4 text-center text-xs opacity-70" style={{ backgroundColor: '#393f4d' }}>
        <div className="flex justify-center gap-1 items-center">
          <Star size={14} /> Powered by CAFE-HUB
        </div>
      </footer>
    </div>
  );
}
