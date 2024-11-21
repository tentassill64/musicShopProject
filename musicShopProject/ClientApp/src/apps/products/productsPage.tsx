import { Box, Button, Card, CardContent, CardMedia, Chip, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductProvider } from "../../domain/products/productProvider";
import { Product } from "../../domain/products/product";
import { ProductStatus } from "../../domain/products/enum/ProductStatus";
import { EditIconButton } from "../../sharedComponents/buttons/editIconButton";
import { SiteLinks } from "../../tools/links";

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();
    const noImage = "no_image.png";

    useEffect(() => {
        loadProducts(null);
    }, []);

    async function loadProducts(categoryId: string | null) {
        const products = await ProductProvider.getProducts(categoryId);
        setProducts(products);
    }

    function getDisplayChip(status: ProductStatus) {
        switch(status) {
            case ProductStatus.OnSale: return <Chip label={ProductStatus.getDisplayName(status)} color="success"/>
            case ProductStatus.TemporarilyOutOfSale: return <Chip label={ProductStatus.getDisplayName(status)} color="info"/>
            case ProductStatus.OutOfStock: return <Chip label={ProductStatus.getDisplayName(status)} color="error"/>
            default: return <Chip label={ProductStatus.getDisplayName(status)} color="error"/>
        }
    }

    const transformImagePath = (imageName: string) => {
        console.log(`/images/products/${imageName}`);
        return `/images/products/${imageName}`;
    };

    return (
        <Box>
            <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h4" ml={2} mt={2}>
                    Продукты
                </Typography>
                <Button variant="contained" 
                        color="primary"
                        onClick={() => navigate(SiteLinks.add)}>
                    Добавить
                </Button>
            </Box>
            
            <Divider/> {products.length > 0 &&
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {products.map((product) => (
                    <Grid item xs={12} sm={2} md={2} key={product.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={transformImagePath(product.images[0] ?? noImage)}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Стоимость: ${product.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Вес: {product.weight}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Количество: {product.quantity}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Статус: {getDisplayChip(product.status)}
                                </Typography>
                                <Typography mt={2} variant="body2" color="text.secondary">
                                    Скрыт?: {product.isHidden ? <Chip label="Да" color="error"/> : <Chip label="Нет" color="success"/>}
                                </Typography>
                                <Box display={'flex'} justifyContent={'flex-end'}>
                                    <Box>
                                    <EditIconButton onClick={() => navigate(SiteLinks.editProduct(product.id))}/>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid> }
            {products.length == 0 && 
            <Box>
                 Продукты отсутсвуют
                 </Box>
                }
        </Box>
    );
}
