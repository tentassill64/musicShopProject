import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Chip,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Button,
  Avatar,
  Paper
} from '@mui/material';
import { Product } from '../../domain/products/product';
import { ProductStatus } from '../../domain/products/enum/ProductStatus';
import { ProductProvider } from '../../domain/products/productProvider';
import CircularProgress from '@mui/material/CircularProgress';
import { Countries } from '../../domain/manufactures/countries';
import { useCart } from '../../hooks/cartContextType';

export const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if(productId){
          const data = await ProductProvider.getProduct(productId);
          setProduct(data);
          if (data.images.length > 0) {
            setMainImage(data.images[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
        Товар не найден
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Основной контейнер с фотографиями и характеристиками */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        mb: 4
      }}>
        {/* Блок с изображениями (левая колонка) */}
        <Box sx={{
          width: { xs: '100%', md: '50%' },
          flexShrink: 0
        }}>
          <Card sx={{ mb: 2 }}>
            <CardMedia
              component="img"
              image={mainImage || '/placeholder-image.jpg'}
              alt={product.name}
              sx={{ 
                width: '100%', 
                height: '400px', 
                objectFit: 'contain',
                bgcolor: 'grey.100'
              }}
            />
          </Card>
          
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
            {product.images.map((image, index) => (
              <Card 
                key={index} 
                sx={{ 
                  minWidth: '80px', 
                  cursor: 'pointer',
                  border: image === mainImage ? '2px solid #1976d2' : 'none'
                }}
                onClick={() => setMainImage(image)}
              >
                <CardMedia
                  component="img"
                  image={image}
                  alt={`Изображение ${index + 1}`}
                  sx={{ 
                    width: '100%',
                    height: '80px',
                    objectFit: 'cover',
                    bgcolor: 'grey.100',
                    aspectRatio: '1/1',
                    display: 'block'
                  }}
                />
              </Card>
            ))}
          </Box>
        </Box>

        {/* Блок с характеристиками (правая колонка) */}
        <Box sx={{
          width: { xs: '100%', md: '50%' },
          flexGrow: 1
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Chip
            label={ProductStatus.getDisplayName(product.status)}
            color={
              product.status === ProductStatus.OnSale ? 'success' :
              product.status === ProductStatus.ToOrder ? 'warning' : 'error'
            }
            sx={{ mb: 2 }}
          />
          
          <Typography variant="h3" color="primary" gutterBottom>
            {product.price.toLocaleString('ru-RU')} ₽
          </Typography>
          
          <Paper elevation={0} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 60, 
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              borderRadius: '50%',
              overflow: 'hidden'
            }}>
              <CardMedia
                component="img"
                src={product.manufacturer.logo}
                alt={product.manufacturer.name}
                sx={{
                  width: 'auto',
                  height: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </Box>
            <Box>
              <Typography variant="h6">{product.manufacturer.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {Countries.getDisplayName(product.manufacturer.country)}
              </Typography>
            </Box>
          </Paper>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Характеристики</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: '50%', mb: 1 }}>
                <Typography variant="body2">Вес:</Typography>
              </Box>
              <Box sx={{ width: '50%', mb: 1 }}>
                <Typography variant="body2">{product.weight} кг</Typography>
              </Box>
              <Box sx={{ width: '50%', mb: 1 }}>
                <Typography variant="body2">Наличие:</Typography>
              </Box>
              <Box sx={{ width: '50%', mb: 1 }}>
                <Typography variant="body2">
                  {product.quantity > 0 ? `${product.quantity} шт.` : 'Нет в наличии'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
           <Button 
            variant="contained" 
            size="large"
            disabled={product.quantity === 0 || product.isHidden}
            onClick={() => addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                          categoryId: product.categoryId,
                image: product.images?.[0]
            })}
            >
            В корзину
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Блок описания на всю ширину страницы */}
      <Box sx={{ 
        width: '100%',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        p: 3,
        boxShadow: 1,
        mb: 4
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Описание товара
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {product.description || 'Описание отсутствует'}
        </Typography>
      </Box>
    </Container>
  );
};