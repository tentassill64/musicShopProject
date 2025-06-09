import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import { Category } from '../../domain/products/productsCategories/category';
import { CategoryProvider } from '../../domain/products/productsCategories/categoryProvider';
import Header from '../../header';


export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryProvider.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}/products`);

  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        mb: 4,
        color: 'primary.main',
        fontWeight: 'bold'
      }}>
        Каталог
      </Typography>

<Grid container spacing={4}>
  {categories.map((category) => (
 <Grid>
      <Card sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 6
        },
        border: '1px solid',
        borderColor: 'primary.light',
        backgroundColor: 'background.paper'
      }}>
        <CardActionArea 
          onClick={() => handleCategoryClick(category.id)}
          sx={{ height: '100%' }}
        >
          {category.photo && (
            <CardMedia
              component="img"
              height="200"
              image={category.photo}
              alt={category.name}
              sx={{ 
                objectFit: 'cover',
                backgroundColor: 'primary.50'
              }}
            />
          )}
          <CardContent sx={{ 
            flexGrow: 1,
            backgroundColor: 'primary.50',
            borderTop: '1px solid',
            borderColor: 'primary.light'
          }}>
            <Typography 
              gutterBottom 
              variant="h5" 
              component="div"
              sx={{ 
                color: 'primary.dark',
                fontWeight: 'medium',
                textAlign: 'center'
              }}
            >
              {category.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ))}
</Grid>
    </Container>
  );
};