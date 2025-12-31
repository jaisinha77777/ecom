'use server'
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getOverviewStats() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get productIds owned by user
    const products = await prisma.product.findMany({
      where: { by: userId },
      select: { productId: true }
    });

    const productIds = products.map(p => p.productId);

    // Also fetch product names
    const productMeta = await prisma.product.findMany({
      where: { productId: { in: productIds } },
      select: {
        productId: true,
        productName: true
      }
    });

    const productNameMap = new Map(
      productMeta.map(p => [p.productId, p.productName])
    );

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(now.getDate() - 1);

    // Get last year's confirmed orders
    const revenueData = await prisma.order.findMany({
      where: {
        created_at: { gte: oneYearAgo },
        status: "confirmed"
      },
      select: {
        created_at: true,
        items: {
          where: { product_id: { in: productIds } },
          select: {
            product_id: true,
            price: true,
            quantity: true
          }
        }
      }
    });

    // Revenue totals
    let lastYear = 0;
    let lastMonth = 0;
    let lastWeek = 0;
    let lastDay = 0;

    const monthlyRevenue = Array(12).fill(0);

    // Maps for top products
    const yearlyRevenue = new Map();
    const monthlyRevenueMap = new Map();
    const weeklyRevenueMap = new Map();

    const yearlyQty = new Map();
    const monthlyQty = new Map();
    const weeklyQty = new Map();

    revenueData.forEach(order => {
      const date = order.created_at;

      let orderYearTotal = 0;

      order.items.forEach(item => {
        const revenue = parseFloat(item.price.toString()) * item.quantity;
        const pid = item.product_id;

        orderYearTotal += revenue;
        lastYear += revenue;

        // Year aggregation
        yearlyRevenue.set(pid, (yearlyRevenue.get(pid) ?? 0) + revenue);
        yearlyQty.set(pid, (yearlyQty.get(pid) ?? 0) + item.quantity);

        // Month
        if (date >= oneMonthAgo) {
          lastMonth += revenue;
          monthlyRevenueMap.set(pid, (monthlyRevenueMap.get(pid) ?? 0) + revenue);
          monthlyQty.set(pid, (monthlyQty.get(pid) ?? 0) + item.quantity);
        }

        // Week
        if (date >= oneWeekAgo) {
          lastWeek += revenue;
          weeklyRevenueMap.set(pid, (weeklyRevenueMap.get(pid) ?? 0) + revenue);
          weeklyQty.set(pid, (weeklyQty.get(pid) ?? 0) + item.quantity);
        }

        // Day
        if (date >= oneDayAgo) {
          lastDay += revenue;
        }
      });

      // Monthly revenue array (last 12 months)
      const monthDiff =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());

      if (monthDiff < 12) {
        monthlyRevenue[11 - monthDiff] += orderYearTotal;
      }
    });

    // Helper — return sorted top 5 with names
    function top5FromMap(map: Map<string, number>) {
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([product_id, value]) => ({
          product_id,
          name: productNameMap.get(product_id) ?? "Unknown Product",
          value
        }));
    }

    const top5YearRevenue = top5FromMap(yearlyRevenue);
    const top5MonthRevenue = top5FromMap(monthlyRevenueMap);
    const top5WeekRevenue = top5FromMap(weeklyRevenueMap);

    const top5YearQty = top5FromMap(yearlyQty);
    const top5MonthQty = top5FromMap(monthlyQty);
    const top5WeekQty = top5FromMap(weeklyQty);

    return {
      lastYear,
      lastMonth,
      lastWeek,
      lastDay,
      monthlyRevenue,

      topProducts: {
        revenue: {
          year: top5YearRevenue,
          month: top5MonthRevenue,
          week: top5WeekRevenue
        },
        quantity: {
          year: top5YearQty,
          month: top5MonthQty,
          week: top5WeekQty
        }
      }
    };

  } catch (error) {
    console.error(error);
    throw error;
  }
}
