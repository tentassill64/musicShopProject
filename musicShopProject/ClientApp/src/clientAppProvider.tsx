import { Box, extendTheme} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import icon from '../src/assets/favicon-32x32.png'
import { AppProvider, DashboardLayout, PageContainer} from "@toolpad/core";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SiteLinks } from "./tools/links";
import { HomePage} from "./apps/main/homePage";
import InventoryIcon from '@mui/icons-material/Inventory';
import { useDemoRouter } from "./hooks/useDemoRouter";
import { Home, Map } from "@mui/icons-material";
import { ClientsPage } from "./apps/clients/clientsPage";
import { ProductsPage } from "./apps/products/productsPage";
import { NotFoundPage } from "./apps/notFound/notFoundPage";
import { OrderPage } from "./apps/orders/orderPage";
import { MapPage } from "./apps/map/mapPage";
import { EditProductPage } from "./apps/products/editProductPage";
import { AddProductPage } from "./apps/products/addProductPage";

export function ClientAppProvider(props: any) {

      const { window } = props;
      const router = useDemoRouter('');
      const demoWindow = window ? window() : undefined;


    const demoTheme = extendTheme({
        colorSchemes: { light: true, dark: true },
        colorSchemeSelector: 'class',
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

    return (
        <AppProvider
            navigation={[
                {
                    segment:'home',
                    title: 'Домой',
                    icon: <Home/>
                },
                {
                    segment: 'orders',
                    title: 'Заказы',
                    icon: <ShoppingCartIcon/>
                },
                {
                    segment: 'clients',
                    title: 'Клиенты',
                    icon: <PersonIcon/>
                },
                {
                    segment: 'products',
                    title: 'Склад',
                    icon: <InventoryIcon/>
                },
                {
                    segment:'map',
                    title: 'Карта',
                    icon: <Map/>
                }
            ]}
            branding={{
            logo: <img src={icon} alt="Tenta Shop" />,
            title: 'Tenta Shop',
        }}
            router={router}
            theme={demoTheme}
            window={demoWindow}>
    <DashboardLayout >
                <Routes>
                 <Route index path={SiteLinks.home} Component={HomePage}/>
                 <Route index path={SiteLinks.clients} Component={ClientsPage}/>
                 <Route index path={SiteLinks.orders} Component={OrderPage}/>
                 <Route index path={SiteLinks.products} Component={ProductsPage}/>
                 <Route index path="" Component={HomePage}/>
                 <Route index path={SiteLinks.map} Component={MapPage}/>
                 <Route index path="*" Component={NotFoundPage}/>
                 <Route index path={SiteLinks.editProductTemplate} element={<EditProductPage/>}/>
                 <Route index path={SiteLinks.add} Component={AddProductPage}/>
             </Routes>
  </DashboardLayout>
</AppProvider>
    );
}