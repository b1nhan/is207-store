'use client';

import { useEffect, useState } from 'react';
import adminDashboardService from '@/services/adminDashboardService';
import { Package, ShoppingCart, DollarSign, Users, Tags, Layers, Ticket, Megaphone, Box } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, revenueRes, topProductsRes] = await Promise.all([
          adminDashboardService.getSummary(),
          adminDashboardService.getRevenue(),
          adminDashboardService.getTopProducts({ limit: 10 }),
        ]);
        setSummary(summaryRes.data);
        setRevenue(Array.isArray(revenueRes.data) ? revenueRes.data : []);
        setTopProducts(Array.isArray(topProductsRes.data) ? topProductsRes.data : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Doanh thu',
      value: `${parseFloat(summary?.total_revenue || 0).toLocaleString('vi-VN')}₫`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Tổng đơn hàng',
      value: summary?.total_orders ?? 0,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Đơn chờ xử lý',
      value: summary?.pending_orders ?? 0,
      icon: Package,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Tổng người dùng',
      value: summary?.total_users ?? 0,
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Sản phẩm',
      value: summary?.total_products ?? 0,
      icon: Box,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Brand',
      value: summary?.total_brands ?? 0,
      icon: Tags,
      color: 'bg-pink-100 text-pink-600',
    },
    {
      title: 'Danh mục',
      value: summary?.total_categories ?? 0,
      icon: Layers,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Voucher',
      value: summary?.total_vouchers ?? 0,
      icon: Ticket,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Campaign',
      value: summary?.total_campaigns ?? 0,
      icon: Megaphone,
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className={`p-4 rounded-full ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="flex flex-col gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Tổng Quan Doanh Thu</h3>
          {/* Wrapper cho phép scroll ngang */}
          <div className="overflow-x-scroll p-5">
            {/* Container có chiều rộng tối thiểu để tránh nội dung bị ép nhỏ */}
            <div style={{ minWidth: `${Math.max(revenue.length * 60, 400)}px` }} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenue.map(r => ({ ...r, revenue: parseFloat(r.revenue) }))}
                  margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis
                    tickFormatter={(v) => v.toLocaleString('vi-VN')}
                    width={80}
                  />
                  <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')}₫`, 'Doanh thu']} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Các Sản Phẩm Bán Chạy</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts.map(p => ({
                  name: p.product_name,
                  sold_quantity: parseInt(p.sold_quantity, 10),
                  total_revenue: parseFloat(p.total_revenue),
                }))}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'sold_quantity') return [value, 'Đã bán'];
                    if (name === 'total_revenue') return [`${value.toLocaleString('vi-VN')}₫`, 'Doanh thu'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="sold_quantity" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
