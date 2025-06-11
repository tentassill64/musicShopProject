import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import { Product } from '../../domain/products/product';
import { ProductStatus } from '../../domain/products/enum/ProductStatus';
import { ProductProvider } from '../../domain/products/productProvider';
import { useCart } from '../../hooks/cartContextType';

export const ProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 100]);
  const [selectedStatuses, setSelectedStatuses] = useState<ProductStatus[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductProvider.getProducts(categoryId);
        setProducts(data);
        setFilteredProducts(data);
        
        if (data.length > 0) {
          const prices = data.map(p => p.price);
          const weights = data.map(p => p.weight);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
          setWeightRange([Math.min(...weights), Math.max(...weights)]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    let result = [...products];

    result = result.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    result = result.filter(p => 
      p.weight >= weightRange[0] && p.weight <= weightRange[1]
    );

    if (selectedStatuses.length > 0) {
      result = result.filter(p => selectedStatuses.includes(p.status));
    }

    if (selectedManufacturers.length > 0) {
      result = result.filter(p => selectedManufacturers.includes(p.manufacturer.name));
    }

    setFilteredProducts(result);
  }, [priceRange, weightRange, selectedStatuses, selectedManufacturers, products]);

  const handleStatusChange = (status: ProductStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleManufacturerChange = (manufacturer: string) => {
    setSelectedManufacturers(prev =>
      prev.includes(manufacturer)
        ? prev.filter(m => m !== manufacturer)
        : [...prev, manufacturer]
    );
  };

  const allManufacturers = Array.from(
    new Map(
      products.map(product => [product.manufacturer.id, product.manufacturer])
    ).values()
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ 
      maxWidth: '1920px',
      py: 4,
      px: { xs: 2, sm: 3, md: 4 }
    }}>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 4 
      }}>

        <Box sx={{ 
          width: { xs: '100%', md: '300px' },
          flexShrink: 0,
          p: 3, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
          position: { md: 'sticky' },
          top: 20,
          alignSelf: 'flex-start',
          maxHeight: { md: 'calc(100vh - 40px)' },
          overflowY: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>Фильтры</Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Цена: {priceRange[0]} - {priceRange[1]} ₽</Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={Math.min(...products.map(p => p.price))}
              max={Math.max(...products.map(p => p.price))}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Вес: {weightRange[0]} - {weightRange[1]} кг</Typography>
            <Slider
              value={weightRange}
              onChange={(_, newValue) => setWeightRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={Math.min(...products.map(p => p.weight))}
              max={Math.max(...products.map(p => p.weight))}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Статус</Typography>
            <FormGroup>
              {Object.values(ProductStatus)
                .filter((v): v is ProductStatus => typeof v === 'number')
                .map(status => (
                  <FormControlLabel
                    key={status.toString()}
                    control={
                      <Checkbox
                        checked={selectedStatuses.includes(status)}
                        onChange={() => handleStatusChange(status)}
                      />
                    }
                    label={ProductStatus.getDisplayName(status)}
                  />
                ))}
            </FormGroup>
          </Box>
          
          <Box>
            <Typography gutterBottom>Производитель</Typography>
            <FormGroup>
              {allManufacturers.map(manufacturer => (
                <FormControlLabel
                  key={manufacturer.id}
                  control={
                    <Checkbox
                      checked={selectedManufacturers.includes(manufacturer.name)}
                      onChange={() => handleManufacturerChange(manufacturer.name)}
                      disabled={!filteredProducts.some(p => p.manufacturer.id === manufacturer.id)}
                    />
                  }
                  label={manufacturer.name}
                  sx={{
                    opacity: filteredProducts.some(p => p.manufacturer.id === manufacturer.id) ? 1 : 0.5
                  }}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Товары ({filteredProducts.length})
          </Typography>
          
          {filteredProducts.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
              Товары не найдены
            </Typography>
          ) : (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 3
            }}>
              {filteredProducts.map(product => (
                <Card 
                  key={product.id}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 3,
                    }
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.images?.length > 0 && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0]}
                      alt={product.name}
                      sx={{ 
                        objectFit: 'contain',
                        bgcolor: 'grey.100',
                        width: '100%',
                        maxHeight: 200
                      }}
                    />
                  )}
                  <CardContent sx={{ 
                    flexGrow: 1,
                    bgcolor: 'grey.100',
                  }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="div"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {product.manufacturer.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </Typography>
                      <Chip 
                        label={ProductStatus.getDisplayName(product.status)}
                        color={
                          product.status === ProductStatus.OnSale ? 'success' :
                          product.status === ProductStatus.ToOrder ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Вес: {product.weight} кг
                    </Typography>
                    <Button 
                      variant="contained" 
                      sx={{ width: '100%', mt: 2 }}
                      disabled={product.quantity === 0 || product.isHidden}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          categoryId: product.categoryId,
                          image: product.images?.[0]
                        });
                      }}
                    >
                      В корзину
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};