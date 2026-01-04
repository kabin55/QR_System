import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Search, Printer } from 'lucide-react'
import { socket } from '../../utils/socket'
import Navbar from '../../components/AdminComponent/NavBar'
import { useToast } from '../../utils/toastProvider'
import {
  fetchOrders,
  updateOrderStatusApi,
} from '../../service/adminapi'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [revenueFilter, setRevenueFilter] = useState('today')
  const [soundEnabled, setSoundEnabled] = useState(false)

  const { showToast } = useToast()

  const audioRef = useRef(null)
  const previousOrdersRef = useRef([])
  const soundEnabledRef = useRef(false)

  const restaurantId = JSON.parse(
    localStorage.getItem('restaurantDetails')
  )?.restaurantId

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

    const loadOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const list = await fetchOrders(restaurantId, showToast)
        setOrders(list)
        previousOrdersRef.current = list
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [restaurantId, showToast])

  /* -------------------- UPDATE STATUS -------------------- */
  const updateOrderStatus = async (orderId, status) => {
    const backup = orders

    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    )

    try {
      await updateOrderStatusApi(orderId, status, showToast)
    } catch (err) {
      setOrders(backup)
      setError(err.message)
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

      const searched = filtered
        .filter(
          (o) =>
            o._id.includes(search) ||
            (o.tableno || '').includes(search) ||
            o.items.some((i) => i.item.includes(search))
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )

      return {
        filteredOrders: searched,
        pendingOrders: filtered.filter((o) => o.status === 'pending')
          .length,
        completedOrders: filtered.filter(
          (o) => o.status === 'completed'
        ).length,
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <audio ref={audioRef} src="/notification.mp3" preload="auto" />
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by order ID, table no, item, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Search orders by ID, table number, item, or status"
              />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-600">
              Pending Orders (Today)
            </h2>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-600">
              Completed Orders (Today)
            </h2>
            <p className="text-2xl font-bold">{completedOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-green-600">
              Total Revenue
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-green-600">
                Rs: {totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>{' '}
          <label className="flex items-center gap-3 cursor-pointer mb-6">
            <span>Enable Notification</span>
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onClick={() => {
                if (!soundEnabled) {
                  // audioRef.current?.play().then(() => audioRef.current?.pause())
                  audioRef.current?.play()
                }
                setSoundEnabled(!soundEnabled)
              }}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  soundEnabled ? 'translate-x-6' : ''
                }`}
              />
            </div>
          </label>
        </section>
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange('today')}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-md transform hover:scale-105 ${
              revenueFilter === 'today'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-indigo-500/50'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            aria-pressed={revenueFilter === 'today'}
            aria-label="Show total revenue and orders for today"
          >
            Today
          </button>
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-md transform hover:scale-105 ${
              revenueFilter === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-indigo-500/50'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            aria-pressed={revenueFilter === 'all'}
            aria-label="Show total revenue and orders for all time"
          >
            All
          </button>
        </div>

        {/* Orders Table */}
        <section className="bg-white rounded-lg shadow">
          <div className="hidden md:block text-center overflow-x-auto">
            <table className="min-w-full text-center table-auto border-collapse border border-gray-200">
              <caption className="sr-only">Customer orders</caption>
             <thead className="bg-gray-100">
  <tr>
    <th
      className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700"
      scope="col"
    >
      Order ID
    </th>
    <th
      className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700"
      scope="col"
    >
      Table No
    </th>
    <th
      className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700"
      scope="col"
    >
      Items
    </th>
    <th
      className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700"
      scope="col"
    >
      Total - (Rs.)
    </th>
    <th
      className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700"
      scope="col"
    >
      Status
    </th>
    <th
      className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700"
      scope="col"
    >
      Date
    </th>
    <th
      className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700"
      scope="col"
    >
      Actions
    </th>
  </tr>
</thead>

              <tbody>
  {filteredOrders.length === 0 ? (
    <tr>
      <td colSpan={7} className="text-center p-4 text-gray-500">
        No orders found.
      </td>
    </tr>
  ) : (
    filteredOrders.map((order) => (
      <tr key={order._id} className="hover:bg-gray-50">
        {/* Order ID */}
        <td className="border border-gray-300 px-3 py-2 font-medium">
          {order._id}
        </td>

        {/* Table Number */}
        <td className="border border-gray-300 px-3 py-2 text-center font-bold">
          {order.tableno ?? 'N/A'}
        </td>

        {/* Items */}
        <td className="border border-gray-300 px-3 py-2">
          {order.items.map((item, i) => {
            const isRequested = item.item.toLowerCase().includes("requested to visit table")
            return (
              <div key={i} className="text-sm mb-1">
                <span
                  className={`inline-block px-2 py-1 rounded-md font-semibold ${
                    isRequested
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.item} ×{item.quantity}
                </span>
              </div>
            )
          })}
        </td>

        {/* Subtotal */}
        <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
          Rs: {(order.subtotal || 0).toFixed(2)}
        </td>

        {/* Status Buttons */}
        <td className="border border-gray-300 px-3 py-2">
          <div className="flex flex-wrap gap-2">
            {['pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => updateOrderStatus(order._id, status)}
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  order.status === status
                    ? status === 'pending'
                      ? 'bg-yellow-300 text-yellow-900'
                      : 'bg-green-300 text-green-900'
                    : 'bg-gray-200 text-gray-700 hover:bg-' + (status === 'pending' ? 'yellow-200' : 'green-200')
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </td>

        {/* Created At */}
        <td className="border border-gray-300 px-3 py-2">
          {new Date(order.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </td>

        {/* Print Button */}
        <td className="border border-gray-300 px-3 py-2">
          <button
            onClick={() => printBill(order)}
            className="px-3 py-1 text-xs rounded-full font-semibold bg-blue-200 text-blue-900 hover:bg-blue-300"
            aria-label={`Print bill for order ${order._id}`}
          >
            <Printer className="inline-block h-4 w-4 mr-1" />
            Print
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
          <div className="md:hidden space-y-4 p-4">
            {isLoading ? (
              <div className="text-center p-4">Loading orders...</div>
            ) : error ? (
              <div className="text-center p-4 text-red-600">{error}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No orders found.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 p-4 rounded-md"
                >
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Table No:</strong> {order.tableno ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Items:</strong>{' '}
                    {order.items
                      .map((item) => `${item.item} ×${item.quantity}`)
                      .join(', ')}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs:{' '}
                    {(order.subtotal || 0).toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(order.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateOrderStatus(order._id, 'pending')}
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        order.status === 'pending'
                          ? 'bg-yellow-300 text-yellow-900'
                          : 'bg-gray-200 text-gray-700 hover:bg-yellow-200'
                      }`}
                      aria-pressed={order.status === 'pending'}
                      aria-label={`Set order ${order._id} status to pending`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, 'completed')}
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        order.status === 'completed'
                          ? 'bg-green-300 text-green-900'
                          : 'bg-gray-200 text-gray-700 hover:bg-green-200'
                      }`}
                      aria-pressed={order.status === 'completed'}
                      aria-label={`Set order ${order._id} status to completed`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => printBill(order)}
                      className="px-3 py-1 text-xs rounded-full font-semibold bg-blue-200 text-blue-900 hover:bg-blue-300"
                      aria-label={`Print bill for order ${order._id}`}
                    >
                      <Printer className="inline-block h-4 w-4 mr-1" />
                      Print
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
    </div>
  )
}
