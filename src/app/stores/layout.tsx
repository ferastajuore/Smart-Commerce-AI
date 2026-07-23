// Stores layout — enforces STORE_OWNER session
// Ref: ARCHITECTURE.md §5 (Auth Module enforces role separation),
// SECURITY.md §4.3 (app/stores/layout.tsx verifies session role),
// SECURITY.md §5.1 (two-layer enforcement — routing + service),
// PRD.md AUTH-3, AUTH-4 (Store Owner session is valid only for /stores/*),
// FOLDER_STRUCTURE.md §4 (stores/layout.tsx enforces STORE_OWNER session)

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logout } from "@/modules/auth/actions/logout";
import {
  DashboardLayout,
  Sidebar,
  Header
} from "@/shared/layout";
import { SearchInput } from "@/shared/ui/Input/search-input";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  User,
  Hexagon,
  Bell,
  Boxes,
} from "lucide-react";

interface StoresLayoutProps {
  children: ReactNode;
}

export default async function StoresLayout({
  children,
}: StoresLayoutProps) {
  const session = await getServerSession(authOptions);

  // No session — redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  // Wrong role — redirect to admin area
  if (session.user.role !== "STORE_OWNER") {
    redirect("/admin");
  }

  // No workspaceId — Store Owner without a workspace cannot operate
  if (!session.user.workspaceId) {
    redirect("/login");
  }

  // Retrieve workspace business name
  const workspace = await prisma.workspace.findUnique({
    where: { id: session.user.workspaceId },
  });

  const workspaceName = workspace?.businessName || "متجري";
  const planKicker = workspace?.status === "TRIAL" ? "تجربة مجانية - 14 يوم" : "الخطة المؤسسية";

  // Sidebar navigation items in Arabic matching the design redesign
  const sidebarItems = [
    {
      label: "لوحة التحكم",
      icon: <LayoutDashboard size={18} />,
      href: "/stores/dashboard",
    },
    {
      label: "المنتجات",
      icon: <Package size={18} />,
      href: "/stores/products",
    },
    {
      label: "المخزون",
      icon: <Boxes size={18} />,
      href: "/stores/inventory",
    },
    {
      label: "الطلبات",
      icon: <ShoppingCart size={18} />,
      href: "/stores/orders",
    },
    {
      label: "ماسينجر",
      icon: <MessageSquare size={18} />,
      href: "/stores/messenger",
    },
    {
      label: "الاشتراك",
      icon: <CreditCard size={18} />,
      href: "/stores/subscription",
    },
    {
      label: "الإعدادات",
      icon: <Settings size={18} />,
      href: "/stores/settings",
    },
    {
      label: "الملف الشخصي",
      icon: <User size={18} />,
      href: "/stores/profile",
    },
  ];

  // User details block inside the sidebar footer in Arabic
  const userBlock = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-surface-tertiary transition-colors">
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
          <User size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold truncate text-foreground">
            {session.user.email}
          </p>
          <p className="text-caption text-muted truncate">صاحب المتجر</p>
        </div>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-4 py-2 text-body-sm font-medium text-danger hover:bg-danger-soft rounded-lg transition-all text-right"
        >
          <LogOut size={16} className="shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </form>
    </div>
  );

  return (
    <div dir="rtl" className="rtl">
      <DashboardLayout
        sidebar={
          <Sidebar
            items={sidebarItems}
            logo={<Hexagon className="text-accent" size={18} />}
            productName={workspaceName}
            kicker={planKicker}
            userBlock={userBlock}
          />
        }
        header={
          <Header
            left={
              <div className="w-80">
                <SearchInput placeholder="بحث في رؤى النظام، السجلات، أو المنتجات..." />
              </div>
            }
            right={
              <div className="flex items-center gap-4">
                {/* Notification bell with unread dot */}
                <button
                  className="relative p-2 rounded-lg text-muted hover:bg-surface-tertiary hover:text-foreground transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
                </button>

                {/* User Info dropdown block from mockup */}
                <div className="flex items-center gap-3 border-r border-separator pr-4 text-right">
                  <div>
                    <p className="text-body-sm font-semibold text-foreground max-w-[120px] truncate">
                      {session.user.email.split("@")[0]}
                    </p>
                    <p className="text-[10px] font-bold text-muted font-mono tracking-wider">
                      صاحب المتجر
                    </p>
                  </div>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border ring-2 ring-accent/20 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover"
                      alt="User Avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH_gy4sx5yiEVyMe49I-myu_hYZBvpHOHagVMzJDu0buI66F3GTP1WLNmW-wHgvMmJaKMlNYyRTFWTQNUfVCZQ8kqg1cJbveCkzbsQOP6pLmM3AhDckqgV5XjZ6k67CBBIqnEjyemB-yNhCMTsyjIanSb2MK0onSkoHcDtpBSkF_znv5HJrs-2gGvRgbGyXSA0cLDJyXBeRwZXhAWQo2xVbFpgiohW2_q7x0sHnTbOykvQnIZOH89_iwwCjVSC9_8HbREAvmtdW9A"
                    />
                    <span className="absolute bottom-0 left-0 w-2 h-2 bg-success rounded-full border border-background" />
                  </div>
                </div>
              </div>
            }
          />
        }
      >
        <div className="flex flex-col min-h-[calc(100vh-8rem)]">
          <div className="flex-1">{children}</div>
          
          {/* Shared Global Footer in Arabic */}
          <footer className="mt-auto pt-8 border-t border-separator text-caption text-muted">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
              <p>© {new Date().getFullYear()} سمارت كومرس الذكاء الاصطناعي. جميع الحقوق محفوظة.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-foreground transition-colors">سياسة الخصوصية</a>
                <a href="#" className="hover:text-foreground transition-colors">شروط الخدمة</a>
                <a href="#" className="hover:text-foreground transition-colors">الدعم الفني</a>
              </div>
            </div>
          </footer>
        </div>
      </DashboardLayout>
    </div>
  );
}
