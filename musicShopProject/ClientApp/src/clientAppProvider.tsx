import { Box, extendTheme } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import icon from '../src/assets/favicon-32x32.png';
import { Account, AppProvider, DashboardLayout, PageContainer, Session } from "@toolpad/core";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import { SiteLinks } from "./tools/links";
import { HomePage } from "./apps/main/homePage";
import InventoryIcon from '@mui/icons-material/Inventory';
import { useDemoRouter } from "./hooks/useDemoRouter";
import { Home, Logout, Map } from "@mui/icons-material";
import { ClientsPage } from "./apps/clients/clientsPage";
import { ProductsPage } from "./apps/products/productsPage";
import { NotFoundPage } from "./apps/notFound/notFoundPage";
import { OrderPage } from "./apps/orders/orderPage";
import { MapPage } from "./apps/map/mapPage";
import FactoryIcon from '@mui/icons-material/Factory';
import { EditProductPage } from "./apps/products/editProductPage";
import { AddProductPage } from "./apps/products/addProductPage";
import { LoginModal } from "./apps/auth/LoginPage";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { CategoriesPage } from "./apps/categories/categoriesPage";
import { ManufactorPage } from "./apps/manufactor/manufactrorPage";

export function ClientAppProvider(props: any) {
  const { window } = props;
  const router = useDemoRouter('');
  const demoWindow = window ? window() : undefined;
  const [session, setSession] = useState<Session | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth") === "true";
    const email = localStorage.getItem("email");
    
    if (isAuth && email) {
      setSession({
        user: {
          name: 'Владислав Михеев',
          email: email,
          image: 'https://avatars.githubusercontent.com/u/1488',
        },
      });
    } else {
      setSession(null);
    }
  }, [isAuthenticated]);

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        const email = localStorage.getItem("email");
        if (email) {
          setSession({
            user: {
              name: 'Владислав Михеев',
              email: email,
              image: 'https://avatars.githubusercontent.com/u/1488',
            },
          });
        }
      },
      signOut: () => {
        localStorage.removeItem("isAuth");
        localStorage.removeItem("email");
        setSession(null);
      },
    };
  }, []);

  const demoTheme = extendTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1980,
        xl: 1536,
      },
    },
  });

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuth= localStorage.getItem("isAuth");
    if (isAuth != "true") {
      return <Navigate to={SiteLinks.login} replace />;
    }
    return children;
  };

  return (
    <AppProvider
      navigation={[
        {
          segment: 'home',
          title: 'Домой',
          icon: <Home />
        },
        {
          segment: 'orders',
          title: 'Заказы',
          icon: <ShoppingCartIcon />
        },
        {
          segment: 'clients',
          title: 'Клиенты',
          icon: <PersonIcon />
        },
        {
          segment: 'products',
          title: 'Склад',
          icon: <InventoryIcon />
        },
        {
          segment: 'categories',
          title:'Категории',
          icon: <CategoryIcon />
        },
        {
          segment: 'manufactor',
          title: 'Производители',
          icon: <FactoryIcon/>
        }
      ]}
      branding={{
        logo: <img src={icon} alt="Tenta Shop" />,
        title: 'Tenta Shop',
      }}
      authentication={authentication}
      session={session}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <Box>
        <DashboardLayout
  slots={{
    toolbarAccount: Account
  }}
  slotProps={{
    toolbarAccount: {
      slotProps: {
        signInButton: { color: 'success' },
        signOutButton: { 
          color: 'success',
          startIcon: <Logout />,
        },
        preview: {
          variant: 'expanded',
          slotProps: {
            avatarIconButton: {
              sx: { width: 'fit-content', margin: 'auto' }
            },
            avatar: { variant: 'rounded' }
          }
        }
      }
    }
  }}
>
          <Routes>
            <Route path={SiteLinks.login} element={<LoginModal onLoginSuccess={authentication.signIn}/>} />
            
            <Route path={SiteLinks.home} element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path={SiteLinks.clients} element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            } />
            <Route path={SiteLinks.orders} element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            } />
            <Route path={SiteLinks.products} element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            } />
            <Route path={SiteLinks.editProductTemplate} element={
              <ProtectedRoute>
                <EditProductPage />
              </ProtectedRoute>
            } />
            <Route path={SiteLinks.add} element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            } />
            <Route path={SiteLinks.manufactor} element= {
              <ProtectedRoute>
                <ManufactorPage/>
              </ProtectedRoute>
            } />
            <Route path={SiteLinks.categories} element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            } />
            
            {/* Перенаправление с корня */}
            <Route index element={
              isAuthenticated ? <Navigate to={SiteLinks.home} /> : <Navigate to={SiteLinks.login} />
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </DashboardLayout>
      </Box>
    </AppProvider>
  );
}