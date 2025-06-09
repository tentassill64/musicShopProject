import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Divider, 
  Grid, 
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductProvider } from "../../domain/products/productProvider";
import { Product } from "../../domain/products/product";
import { ProductStatus } from "../../domain/products/enum/ProductStatus";
import { EditIconButton } from "../../sharedComponents/buttons/editIconButton";
import { SiteLinks } from "../../tools/links";
import SearchIcon from '@mui/icons-material/Search';

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
    const navigate = useNavigate();
    const noImage = "no_image.png";

    useEffect(() => {
        loadProducts(null);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchQuery, statusFilter]);

    async function loadProducts(categoryId: string | null) {
        const products = await ProductProvider.getProducts(categoryId);
        setProducts(products);
    }

    function applyFilters() {
        let result = [...products];
        
        // Фильтрация по поисковому запросу
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) 
                // product.manufacturer.toLowerCase().includes(query)
            );
        }
        
        // Фильтрация по статусу
        if (statusFilter !== "all") {
            result = result.filter(product => product.status === statusFilter);
        }
        
        setFilteredProducts(result);
    }

    function getDisplayChip(status: ProductStatus) {
        switch(status) {
            case ProductStatus.OnSale: return <Chip label={ProductStatus.getDisplayName(status)} color="success" size="small"/>
            case ProductStatus.TemporarilyOutOfSale: return <Chip label={ProductStatus.getDisplayName(status)} color="info" size="small"/>
            case ProductStatus.OutOfStock: return <Chip label={ProductStatus.getDisplayName(status)} color="error" size="small"/>
            default: return <Chip label={ProductStatus.getDisplayName(status)} color="default" size="small"/>
        }
    }

    const transformImagePath = (imageName: string) => {
        return `/images/products/${imageName}`;
    };

    // Получаем все возможные значения enum
    const allStatusValues = Object.values(ProductStatus)
        .filter(value => typeof value === 'number') as ProductStatus[];

    return (
        <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    Продукты
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate(SiteLinks.add)}
                >
                    Добавить продукт
                </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }}/>

            {/* Панель фильтров и поиска */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Поиск продуктов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ maxWidth: 400 }}
                    />

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Статус</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Статус"
                            onChange={(e) => {
                                const value = e.target.value;
                                setStatusFilter(value === "all" ? "all" : value as ProductStatus);
                            }}
                        >
                            <MenuItem value="all">Все статусы</MenuItem>
                            {allStatusValues.map(status => (
                                <MenuItem 
                                    key={status}
                                    value={status}
                                >
                                    {ProductStatus.getDisplayName(status)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Chip 
                        label={`Найдено: ${filteredProducts.length}`} 
                        color="info"
                        variant="outlined"
                    />
                </Stack>
            </Box>

            {/* Список продуктов */}
            {filteredProducts.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={transformImagePath(product.images[0] ?? noImage)}
                                    alt={product.name}
                                    sx={{ objectFit: 'contain', p: 1 }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {product.manufacturer}
                                    </Typography> */}
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {product.description.length > 50 
                                            ? `${product.description.substring(0, 50)}...` 
                                            : product.description}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">
                                            Цена: <strong>₽{product.price.toFixed(2)}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            Вес: <strong>{product.weight}г</strong>
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">
                                            Количество: <strong>{product.quantity}</strong>
                                        </Typography>
                                        {getDisplayChip(product.status)}
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Chip 
                                            label={product.isHidden ? "Скрыт" : "Видим"} 
                                            color={product.isHidden ? "error" : "success"} 
                                            size="small"
                                        />
                                        <EditIconButton 
                                            onClick={() => navigate(SiteLinks.editProduct(product.id))}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '200px',
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1
                }}>
                    <Typography variant="h6" color="text.secondary">
                        {products.length === 0 ? "Продукты отсутствуют" : "Ничего не найдено"}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}