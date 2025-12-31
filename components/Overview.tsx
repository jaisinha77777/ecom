'use client'
import { getOverviewStats } from '@/actions/getStats'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { TrendingUp } from 'lucide-react'


const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function renderList(list: any[], formatter?: (n: number) => string) {
  if (!list || list.length === 0)
    return (
      <p className="text-muted-foreground text-xs mt-2">
        No data available
      </p>
    );

  return (
    <div className="space-y-3 text-sm mt-3">
      {list.map(p => (
        <div key={p.product_id} className="flex items-center justify-between">
          <span>{p.name.length > 30 ? p.name.substring(0, 30) + "..." : p.name}</span>
          <span className="font-medium">
            {formatter ? formatter(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}
function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  });
}
const Overview = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['overview-data'],
    queryFn: getOverviewStats
  })

  if (isLoading) {
    return <div>Loading...</div>
  }



  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig


  const chartData = data?.monthlyRevenue.map((v, i) => ({
    month: monthLabels[i],
    revenue: v
  }))
  console.log(data)
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Total Sales Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹ {data?.lastDay}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Total Sales This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹ {data?.lastWeek}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Total Sales This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹ {data?.lastMonth}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Total Sales This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹ {data?.lastYear}</p>
          </CardContent>
        </Card>
      </div>
<div className="grid gap-4 lg:grid-cols-3 mt-4">
  {/* Chart takes 2 columns */}
  <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Last 12 months</CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    valueFormatter={(v) =>
                      `₹ ${Number(v).toLocaleString("en-IN")}`
                    }
                  />
                }
              />

              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
       </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">
            Bestselling Products
          </CardTitle>
        </CardHeader>

        <CardContent>

          {/* OUTER TABS */}
          <Tabs defaultValue="revenue">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="revenue">
                By Revenue
              </TabsTrigger>
              <TabsTrigger value="units">
                By Units Sold
              </TabsTrigger>
            </TabsList>

            {/* ================= REVENUE TAB ================= */}
            <TabsContent value="revenue" className="mt-4">

              <Tabs defaultValue="year">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="year">Year</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                </TabsList>

                <TabsContent value="year">
                  {renderList(data?.topProducts.revenue.year, formatCurrency)}
                </TabsContent>

                <TabsContent value="month">
                  {renderList(data?.topProducts.revenue.month, formatCurrency)}
                </TabsContent>

                <TabsContent value="week">
                  {renderList(data?.topProducts.revenue.week, formatCurrency)}
                </TabsContent>
              </Tabs>

            </TabsContent>

            {/* ================= UNITS TAB ================= */}
            <TabsContent value="units" className="mt-4">

              <Tabs defaultValue="year">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="year">Year</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                </TabsList>

                <TabsContent value="year">
                  {renderList(data?.topProducts.quantity.year, v => `${v} units`)}
                </TabsContent>

                <TabsContent value="month">
                  {renderList(data?.topProducts.quantity.month, v => `${v} units`)}
                </TabsContent>

                <TabsContent value="week">
                  {renderList(data?.topProducts.quantity.week, v => `${v} units`)}
                </TabsContent>
              </Tabs>

            </TabsContent>

          </Tabs>

        </CardContent>
      </Card>
      </div>
    </>
  )
}

export default Overview
