import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Search, Printer } from 'lucide-react'
import { socket } from '../../utils/socket'
import Navbar from '../../components/AdminComponent/NavBar'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [revenueFilter, setRevenueFilter] = useState('today')
  const [soundEnabled, setSoundEnabled] = useState(false)

  const audioRef = useRef(null)
  const previousOrdersRef = useRef([])
  const soundEnabledRef = useRef(false)

  const restaurantId = JSON.parse(
    localStorage.getItem('restaurantDetails')
  )?.restaurantId

  /* -------------------- HELPERS -------------------- */
  const handleFilterChange = (filter) => {
    setRevenueFilter(filter)
  }

  /* -------------------- SOUND REF -------------------- */
  useEffect(() => {
    soundEnabledRef.current = soundEnabled
  }, [soundEnabled])

  /* -------------------- SOCKET LISTENER -------------------- */
  useEffect(() => {
    const handleOrdersUpdated = (payload) => {
      let newOrders = []

      if (payload?.orders && Array.isArray(payload.orders)) {
        newOrders = payload.orders
      } else if (Array.isArray(payload)) {
        newOrders = payload
      } else {
        console.error('Invalid socket payload:', payload)
        return
      }

      const prevMap = Object.fromEntries(
        previousOrdersRef.current.map((o) => [o._id, o])
      )

      const hasNewItems = newOrders.some((order) => {
        const prev = prevMap[order._id]
        if (!prev) return true

        const prevItems = Object.fromEntries(
          prev.items.map((i) => [i.item, i.quantity])
        )

        return order.items.some(
          (i) =>
            prevItems[i.item] === undefined ||
            prevItems[i.item] < i.quantity
        )
      })

      setOrders(newOrders)

      if (hasNewItems && soundEnabledRef.current && audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }

      previousOrdersRef.current = newOrders
    }

    socket.on('ordersUpdated', handleOrdersUpdated)
    return () => socket.off('ordersUpdated', handleOrdersUpdated)
  }, [])

  /* -------------------- FETCH INITIAL ORDERS -------------------- */
  useEffect(() => {
    if (!restaurantId) return

    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/admin/orders/${restaurantId}`,
          { credentials: 'include' }
        )

        if (!res.ok) throw new Error('Failed to fetch orders')

        const data = await res.json()
        const list = Array.isArray(data.orders) ? data.orders : data
        setOrders(list)
        previousOrdersRef.current = list
      } catch (err) {
        setError('Failed to load orders')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [restaurantId])

  /* -------------------- UPDATE STATUS -------------------- */
  const updateOrderStatus = async (orderId, status) => {
    const backup = orders

    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    )

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/orders/${orderId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
          credentials: 'include',
        }
      )

      if (!res.ok) throw new Error()
    } catch {
      setOrders(backup)
      setError('Failed to update order')
    }
  }

  /* -------------------- PRINT BILL -------------------- */
  const printBill = (order) => {
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
      <body style="font-family: Arial; width:57mm">
        <h3>Order ${order._id}</h3>
        ${order.items
          .map(
            (i) =>
              `<p>${i.item} ×${i.quantity} — Rs ${(i.price ?? 0).toFixed(
                2
              )}</p>`
          )
          .join('')}
        <hr/>
        <strong>Total: Rs ${(order.subtotal ?? 0).toFixed(2)}</strong>
      </body>
      </html>
    `)
    win.document.close()
    win.print()
  }

  /* -------------------- MEMOS -------------------- */
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }, [])

  const { filteredOrders, pendingOrders, completedOrders, totalRevenue } =
    useMemo(() => {
      const filtered =
        revenueFilter === 'today'
          ? orders.filter(
              (o) =>
                new Date(o.createdAt || Date.now()).getTime() >= today
            )
          : orders

      const searched = filtered.filter(
        (o) =>
          o._id.includes(search) ||
          (o.tableno || '').includes(search) ||
          o.items.some((i) => i.item.includes(search))
      )

      return {
        filteredOrders: searched,
        pendingOrders: filtered.filter((o) => o.status === 'pending').length,
        completedOrders: filtered.filter((o) => o.status === 'completed')
          .length,
        totalRevenue: filtered.reduce(
          (sum, o) => sum + (o.subtotal || 0),
          0
        ),
      }
    }, [orders, search, revenueFilter, today])

  /* -------------------- UI -------------------- */
  return (
    <div>
    <Navbar/>

    <div className="min-h-screen bg-gray-50 p-6">
      <audio
  ref={audioRef}
  src="https://www.soundjay.com/button/sounds/button-3.mp3"
  preload="auto"
/>


      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      {/* CONTROLS */}
      <div className="flex gap-4 mb-4">
        <div className="flex justify-between items-center mb-6">
      <input
    type="text"
    placeholder="Search by order ID"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
   className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
</div>
 
      </div>

      {/* STATS */}
     <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
  <div className="bg-white p-4 shadow rounded-lg flex flex-col">
    <span className="text-gray-500 text-sm">Pending Orders (Today)</span>
    <span className="text-2xl font-bold">{pendingOrders}</span>
  </div>
  <div className="bg-white p-4 shadow rounded-lg flex flex-col">
    <span className="text-gray-500 text-sm">Completed Orders (Today)</span>
    <span className="text-2xl font-bold">{completedOrders}</span>
  </div>
  <div className="bg-white p-4 shadow rounded-lg flex flex-col">
    <span className="text-gray-500 text-sm">Total Revenue</span>
    <span className="text-2xl font-bold text-green-600">
      Rs {totalRevenue.toFixed(2)}
    </span>
  </div>
  <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
    <span className="text-gray-500 text-sm">Enable Notification</span>
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        checked={soundEnabled}
        onChange={() => setSoundEnabled(p => !p)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-full transition-all"></div>
    </label>
  </div>
</div>


      {/* TABLE */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
  <thead className="bg-gray-50 border-b">
    <tr>
      <th className="text-left px-4 py-2 text-gray-600">Order ID</th>
      <th className="text-left px-4 py-2 text-gray-600">Table No</th>
      <th className="text-left px-4 py-2 text-gray-600">Items</th>
      <th className="text-right px-4 py-2 text-gray-600">Total</th>
      <th className="text-center px-4 py-2 text-gray-600">Status</th>
      <th className="text-center px-4 py-2 text-gray-600">Date</th>
      <th className="text-center px-4 py-2 text-gray-600">Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredOrders.map((order) => (
      <tr key={order._id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-2 text-sm">{order._id}</td>
        <td className="px-4 py-2 text-sm">{order.tableno}</td>
        <td className="px-4 py-2 text-sm">
          {order.items.map((i) => `${i.item} ×${i.quantity}`).join(', ')}
        </td>
        <td className="px-4 py-2 text-sm text-right">Rs {(order.subtotal || 0).toFixed(2)}</td>
        <td className="px-4 py-2 text-center space-x-2">
          <button
            onClick={() => updateOrderStatus(order._id, 'pending')}
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              order.status === 'pending' ? 'bg-yellow-300 text-yellow-800' : 'bg-gray-200 text-gray-600'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => updateOrderStatus(order._id, 'completed')}
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              order.status === 'completed' ? 'bg-green-300 text-green-800' : 'bg-gray-200 text-gray-600'
            }`}
          >
            Completed
          </button>
        </td>
        <td className="px-4 py-2 text-center text-sm">{new Date(order.createdAt).toLocaleString()}</td>
        <td className="px-4 py-2 text-center">
          <button
            onClick={() => printBill(order)}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center justify-center"
          >
            <Printer size={16} />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
    </div>
  )
}
