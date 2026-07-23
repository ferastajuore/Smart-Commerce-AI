"use client";

import { useState } from "react";
import {
  Sparkles,
  Calendar,
  Plus,
  Truck,
  Compass,
  AlertTriangle,
  Package,
  ShoppingCart,
  Boxes,
} from "lucide-react";

import { Card } from "@/shared/ui";
import { cn } from "@/shared/utils";
// Mock data presets matching the "Executive Dashboard - Redesign" mockup exactly
const DATA_PRESETS = {
  "30D": {
    totalProducts: 1284,
    totalProductsTrend: 12,
    monthlyOrders: 452,
    monthlyOrdersDistribution: 84,
    inventoryStock: 14209,
    inventoryLowStockCount: 2.4, // representing "2.4k items Low Stock"
    aiUtilization: 84,
    aiMessagesUsed: 8.4, // representing "8.4k of 10k messages used"
    sparklineTotal: "M0 35 Q 25 30, 50 32 T 100 20 T 150 25 T 200 10",
    sparklineOrders: "M0 30 Q 25 35, 50 20 T 100 25 T 150 15 T 200 5",
    sparklineInventory: "M0 25 Q 25 15, 50 18 T 100 10 T 150 12 T 200 5",
    sparklineAi: "M0 10 Q 50 15, 100 12 T 200 35",
    chartTotalPath: "M0 180 Q 150 160, 300 170 T 500 100 T 800 130 T 1000 60",
    chartTotalFill: "M0 180 Q 150 160, 300 170 T 500 100 T 800 130 T 1000 60 L 1000 200 L 0 200 Z",
    chartAiPath: "M0 190 Q 150 185, 300 188 T 500 150 T 800 160 T 1000 120",
  },
  "7D": {
    totalProducts: 1250,
    totalProductsTrend: 8,
    monthlyOrders: 110,
    monthlyOrdersDistribution: 80,
    inventoryStock: 14600,
    inventoryLowStockCount: 2.1,
    aiUtilization: 72,
    aiMessagesUsed: 7.2,
    sparklineTotal: "M0 35 Q 25 32, 50 33 T 100 25 T 150 28 T 200 15",
    sparklineOrders: "M0 32 Q 25 36, 50 25 T 100 28 T 150 20 T 200 10",
    sparklineInventory: "M0 28 Q 25 20, 50 22 T 100 15 T 150 18 T 200 10",
    sparklineAi: "M0 15 Q 50 20, 100 18 T 200 38",
    chartTotalPath: "M0 185 Q 150 170, 300 175 T 500 120 T 800 140 T 1000 80",
    chartTotalFill: "M0 185 Q 150 170, 300 175 T 500 120 T 800 140 T 1000 80 L 1000 200 L 0 200 Z",
    chartAiPath: "M0 195 Q 150 190, 300 192 T 500 160 T 800 170 T 1000 130",
  },
  "90D": {
    totalProducts: 1390,
    totalProductsTrend: 16,
    monthlyOrders: 1420,
    monthlyOrdersDistribution: 89,
    inventoryStock: 13100,
    inventoryLowStockCount: 3.2,
    aiUtilization: 91,
    aiMessagesUsed: 9.1,
    sparklineTotal: "M0 30 Q 25 20, 50 25 T 100 15 T 150 18 T 200 5",
    sparklineOrders: "M0 28 Q 25 30, 50 15 T 100 18 T 150 10 T 200 3",
    sparklineInventory: "M0 22 Q 25 10, 50 15 T 100 8 T 150 10 T 200 2",
    sparklineAi: "M0 8 Q 50 12, 100 10 T 200 30",
    chartTotalPath: "M0 170 Q 150 140, 300 160 T 500 80 T 800 100 T 1000 40",
    chartTotalFill: "M0 170 Q 150 140, 300 160 T 500 80 T 800 100 T 1000 40 L 1000 200 L 0 200 Z",
    chartAiPath: "M0 175 Q 150 160, 300 168 T 500 120 T 800 130 T 1000 90",
  },
};

export default function StoreDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");
  const data = DATA_PRESETS[timeRange];

  return (
    <div className="space-y-6">
      {/* Executive Overview Header & Time Toggles */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-title-xl font-bold text-foreground tracking-tight">
            نظرة عامة تنفيذية
          </h2>
          <p className="text-body-sm text-muted mt-1 leading-relaxed">
            رؤى ذكية في الوقت الفعلي لنظام التجارة العالمي الخاص بك. مؤشرات الأداء تتجه نحو الإيجابية.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white/[0.03] rounded-xl p-1 border border-white/[0.07] shadow-sm">
            <button
              onClick={() => setTimeRange("7D")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all",
                timeRange === "7D"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "text-muted hover:text-foreground"
              )}
            >
              ٧ أيام
            </button>
            <button
              onClick={() => setTimeRange("30D")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all",
                timeRange === "30D"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "text-muted hover:text-foreground"
              )}
            >
              ٣٠ يوم
            </button>
            <button
              onClick={() => setTimeRange("90D")}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all",
                timeRange === "90D"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "text-muted hover:text-foreground"
              )}
            >
              ٩٠ يوم
            </button>
          </div>
          <button className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] px-4 py-2 rounded-xl text-xs font-semibold text-foreground transition-all">
            <Calendar size={14} className="text-muted" />
            <span>نطاق مخصص</span>
          </button>
        </div>
      </div>

      {/* Redesigned Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <Card className="flex flex-col gap-4 p-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-2xl hover:border-accent/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-muted font-mono tracking-wider">
              إجمالي المنتجات
            </span>
            <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center border border-accent/10">
              <Package size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-headline tabular-nums">
              {data.totalProducts.toLocaleString("en-US")}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-success-soft text-success border border-success/15">
              +{data.totalProductsTrend.toLocaleString("en-US")}%
            </span>
          </div>
          <div className="h-10 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
              <path
                d={data.sparklineTotal}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-[10px] text-muted font-medium pt-1 border-t border-white/[0.05]">
            • تم التحديث منذ {(2).toLocaleString("en-US")} دقيقة
          </div>
        </Card>

        {/* Card 2: Monthly Orders */}
        <Card className="flex flex-col gap-4 p-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-2xl hover:border-accent/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-muted font-mono tracking-wider">
              الطلبات الشهرية
            </span>
            <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center border border-accent/10">
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-headline tabular-nums">
              {data.monthlyOrders.toLocaleString("en-US")}
            </span>
            <span className="text-caption text-muted">وحدة</span>
            <span className="mr-auto inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/5 text-muted border border-white/10 font-mono">
              مستقر
            </span>
          </div>
          <div className="pt-2 flex flex-col gap-1.5">
            <div className="text-[10px] text-muted flex justify-between font-mono">
              <span>الحالة:</span>
              <span className="text-success font-bold">
                {data.monthlyOrdersDistribution.toLocaleString("en-US")}% تم التوزيع/الموافقة
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-success h-full transition-all" style={{ width: `${data.monthlyOrdersDistribution}%` }} />
              <div className="bg-warning h-full transition-all" style={{ width: `${100 - data.monthlyOrdersDistribution}%` }} />
            </div>
          </div>
        </Card>

        {/* Card 3: Inventory Stock */}
        <Card className="flex flex-col gap-4 p-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-2xl hover:border-accent/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-muted font-mono tracking-wider">
              مخزون المنتجات
            </span>
            <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center border border-accent/10">
              <Boxes size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-headline tabular-nums">
              {data.inventoryStock.toLocaleString("en-US")}
            </span>
            <span className="mr-auto inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-danger-soft text-danger border border-danger/15 font-mono">
              تنبيه
            </span>
          </div>
          <div className="h-10 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
              <path
                d={data.sparklineInventory}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-[10px] text-warning flex items-center gap-1 font-medium pt-1 border-t border-white/[0.05]">
            <AlertTriangle size={12} className="shrink-0" />
            <span>
              {data.inventoryLowStockCount.toLocaleString("en-US")} ألف منتج منخفض المخزون
            </span>
          </div>
        </Card>

        {/* Card 4: AI Utilization */}
        <Card className="flex flex-col gap-4 p-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-2xl hover:border-accent/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-muted font-mono tracking-wider">
              استخدام الذكاء الاصطناعي
            </span>
            <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center border border-accent/10">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-headline tabular-nums">
              {data.aiUtilization.toLocaleString("en-US")}%
            </span>
            <span className="mr-auto inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent-soft text-accent border border-accent/15 font-mono">
              مميز
            </span>
          </div>
          <div className="pt-2 flex flex-col gap-1.5">
            <div className="text-[10px] text-muted flex justify-between font-mono">
              <span>استهلاك الرسائل:</span>
              <span className="text-foreground">
                {data.aiMessagesUsed.toLocaleString("en-US")} ألف من أصل {(10).toLocaleString("en-US")} آلاف رسالة
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent h-full transition-all" style={{ width: `${data.aiUtilization}%` }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Middle Row: AI Conversation Analytics & Priority Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spline Wave Graph Column (col-span-2) */}
        <Card className="lg:col-span-2 p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-title-lg font-bold text-foreground">تحليلات محادثات الذكاء الاصطناعي</h3>
              <p className="text-body-sm text-muted">تحليل عميق لأنماط تفاعل العملاء التي تمت معالجتها بواسطة الذكاء الاصطناعي</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold font-mono text-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>الاستفسارات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span>معدل الحل</span>
              </div>
            </div>
          </div>
          <div className="relative h-64 w-full mt-2">
            <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
              <div className="border-t border-foreground w-full" />
              <div className="border-t border-foreground w-full" />
              <div className="border-t border-foreground w-full" />
              <div className="border-t border-foreground w-full" />
            </div>
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="glowAreaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Spline fill & stroke matching the redesigned curve */}
              <path d={data.chartTotalFill} fill="url(#glowAreaGradient)" />
              <path d={data.chartTotalPath} fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d={data.chartAiPath} fill="none" stroke="var(--success)" strokeDasharray="6 4" strokeWidth="2" strokeLinecap="round" />
              {/* Highlight dots on coordinates */}
              <circle cx="300" cy="170" r="5" fill="var(--accent)" stroke="var(--background)" strokeWidth="2" />
              <circle cx="500" cy="100" r="5" fill="var(--accent)" stroke="var(--background)" strokeWidth="2" />
              <circle cx="800" cy="130" r="5" fill="var(--accent)" stroke="var(--background)" strokeWidth="2" />
              <circle cx="1000" cy="60" r="5" fill="var(--accent)" stroke="var(--background)" strokeWidth="2" />
            </svg>
            <div className="flex justify-between mt-4 text-[11px] font-bold font-mono text-muted px-2">
              <span>الإثنين</span>
              <span>الثلاثاء</span>
              <span>الأربعاء</span>
              <span>الخميس</span>
              <span>الجمعة</span>
              <span>السبت</span>
              <span>الأحد</span>
            </div>
          </div>
        </Card>

        {/* Priority Actions Column */}
        <Card className="p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex flex-col gap-5 justify-between">
          <div className="space-y-4">
            <h3 className="text-title-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="text-accent shrink-0" size={18} />
              <span>إجراءات ذات أولوية</span>
            </h3>
            <div className="flex flex-col gap-3">
              {/* Action 1: Create New Product */}
              <button className="flex items-center justify-between p-4 bg-accent text-accent-foreground rounded-xl font-semibold hover:brightness-110 active:scale-98 transition-all text-right">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <span>إنشاء منتج جديد</span>
                </div>
                <span className="text-lg">←</span>
              </button>

              {/* Action 2: Deploy Integration */}
              <button className="flex items-center justify-between p-4 bg-white/[0.04] border border-white/[0.06] text-foreground rounded-xl font-semibold hover:bg-white/[0.08] active:scale-98 transition-all text-right">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted">
                    <Compass size={16} />
                  </div>
                  <span>نشر التكامل والربط</span>
                </div>
                <span className="text-lg text-muted">←</span>
              </button>

              {/* Action 3: Batch Process Orders */}
              <button className="flex items-center justify-between p-4 bg-white/[0.04] border border-white/[0.06] text-foreground rounded-xl font-semibold hover:bg-white/[0.08] active:scale-98 transition-all text-right">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted">
                    <Truck size={16} />
                  </div>
                  <span>معالجة الطلبات الجماعية</span>
                </div>
                <span className="text-lg text-muted">←</span>
              </button>
            </div>
          </div>

          {/* Bottom health indicator */}
          <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shrink-0" />
              <span className="text-xs font-semibold text-foreground">حالة ماسينجر: ممتازة</span>
            </div>
            <button className="text-[10px] font-bold text-accent font-mono hover:underline">
              التفاصيل
            </button>
          </div>
        </Card>
      </div>

      {/* Bottom Insights Row: System Logs, Order Distribution, Smart Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: System Logs */}
        <Card className="p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-title-lg font-bold text-foreground">سجلات النظام</h3>
            <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-muted border border-white/10 font-mono">
              تدقيق كامل
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-4 relative pr-2">
            {/* Timeline vertical line */}
            <div className="absolute right-3.5 top-2 bottom-2 w-[1px] bg-white/[0.08]" />

            {/* Log Item 1 */}
            <div className="flex gap-3 items-start relative">
              <div className="w-3 h-3 rounded-full bg-success border-2 border-background z-10 mt-1.5 shrink-0 mr-1" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <p className="text-body-sm font-semibold text-foreground truncate">
                    نجاح الطلب #٨٨٢١
                  </p>
                  <span className="text-[9px] font-bold text-muted shrink-0 font-mono">
                    منذ دقيقتين
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">
                  تم التحقق من الدفع للاشتراك المميز.
                </p>
              </div>
            </div>

            {/* Log Item 2 */}
            <div className="flex gap-3 items-start relative">
              <div className="w-3 h-3 rounded-full bg-warning border-2 border-background z-10 mt-1.5 shrink-0 mr-1" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <p className="text-body-sm font-semibold text-foreground truncate">
                    تنبيه انخفاض المخزون
                  </p>
                  <span className="text-[9px] font-bold text-muted shrink-0 font-mono">
                    منذ ٤٥ دقيقة
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">
                  وصلت &apos;الكاميرا الذكية X1&apos; إلى الحد الأدنى (٤).
                </p>
              </div>
            </div>

            {/* Log Item 3 */}
            <div className="flex gap-3 items-start relative">
              <div className="w-3 h-3 rounded-full bg-accent border-2 border-background z-10 mt-1.5 shrink-0 mr-1" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <p className="text-body-sm font-semibold text-foreground truncate">
                    تحديث بيانات اعتماد API
                  </p>
                  <span className="text-[9px] font-bold text-muted shrink-0 font-mono">
                    منذ ساعتين
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">
                  تم تحديث مفاتيح WhatsApp API بواسطة Alex R.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Order Distribution (Donut Chart) */}
        <Card className="p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex flex-col gap-6">
          <h3 className="text-title-lg font-bold text-foreground">توزيع الطلبات</h3>
          <div className="flex-1 flex flex-col justify-center items-center relative gap-6">
            {/* Donut SVG */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--warning)"
                  strokeWidth="10"
                />
                {/* Colored Progress Ring (84%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.84)}`}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner details */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-foreground font-mono">
                  {data.monthlyOrdersDistribution.toLocaleString("en-US")}%
                </span>
                <span className="text-[10px] text-muted font-bold font-mono">الكفاءة</span>
              </div>
            </div>

            {/* Legends */}
            <div className="w-full flex justify-around text-caption font-semibold font-mono border-t border-white/[0.05] pt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
                <span className="text-muted">الطلبات المعتمدة:</span>
                <span className="text-foreground">{(380).toLocaleString("en-US")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-warning shrink-0" />
                <span className="text-muted">قيد المراجعة:</span>
                <span className="text-foreground">{(62).toLocaleString("en-US")}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Smart Recommendation */}
        <Card className="p-6 bg-gradient-to-br from-accent/15 via-transparent to-transparent border border-accent/25 rounded-2xl flex flex-col gap-5 justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-accent">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="animate-pulse" />
                <span className="text-title-md font-bold">توصيات ذكية</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <p className="text-body-sm font-semibold text-foreground leading-relaxed">
                  مخزون الكاميرا الذكية X1 من المتوقع أن ينفد خلال <span className="text-accent font-bold">٤٨ ساعة</span>.
                </p>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                إن الموافقة على إعادة تخزين فورية لـ ٥٠٠ وحدة ستضمن الحفاظ على مكانة منتجك الأكثر مبيعاً لعطلة نهاية الأسبوع القادمة.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Potential values */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-4 font-mono text-right">
              <div>
                <p className="text-[9px] uppercase font-bold text-muted">الإيرادات المحتملة</p>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {(1420).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-muted">مستوى الثقة</p>
                <p className="text-base font-bold text-success mt-0.5">
                  {(98.2).toLocaleString("en-US")}%
                </p>
              </div>
            </div>

            {/* Authorize button */}
            <button className="w-full py-3 bg-accent text-accent-foreground hover:brightness-110 font-bold rounded-xl text-xs active:scale-98 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40">
              الموافقة على إعادة تخزين جماعي
            </button>
          </div>
        </Card>
      </div>

      {/* Decorative Atmosphere Glows */}
      <div className="fixed top-0 left-0 -z-10 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 -z-10 w-[400px] h-[400px] bg-success/3 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}
