import { useState, useEffect } from "react";
import { Button, TextField, Grid, Paper, Typography, Box, CircularProgress, Card, CardMedia, CardContent, IconButton } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from "../../domain/products/productsCategories/category";
import { CategoryBlank } from "../../domain/products/productsCategories/categoryBlank";
import { CategoryProvider } from "../../domain/products/productsCategories/categoryProvider";
import { useNotifications } from "@toolpad/core";

export function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categoryBlank, setCategoryBlank] = useState<CategoryBlank>(CategoryBlank.getEmpty());
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const notification = useNotifications();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const loadedCategories = await CategoryProvider.getCategories();
            setCategories(loadedCategories);
        } catch (e) {
            console.error("Failed to load categories", e);
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategoryBlank(prev => ({
            ...prev,
            [name]: value
        }));

        // Если меняется поле photo, обновляем превью
        if (name === 'photo') {
            setImagePreview(value || null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!categoryBlank.name) {
            setError("Name is required");
            return;
        }

        try {
            const result = await CategoryProvider.saveCategory(categoryBlank);

            if(result.isSuccess) {
                notification.show("Успешно", {
                    severity: 'success',
                    autoHideDuration: 3000
                });
            } else {
                notification.show(result.errorsString, {
                    severity: 'error',
                    autoHideDuration: 3000
                });
            }

            setCategoryBlank(CategoryBlank.getEmpty());
            setImagePreview(null);
            setError(null);
            await loadCategories();
        } catch (e) {
            console.error("Проблема с сохранением категории", e);
            setError("Проблема с сохранением категории");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            debugger
            const response = await CategoryProvider.removeCategory(id);
            await loadCategories();
        } catch (e) {
            console.error("Проблема с удалением", e);
            setError("Проблема с удалением");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Категории продуктов
            </Typography>
            
            <Grid container spacing={3}>
                {/* Форма создания новой категории */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Создать новую категорию
                        </Typography>
                        
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Название категории"
                                        name="name"
                                        value={categoryBlank.name || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="URL фотографии"
                                        name="photo"
                                        value={categoryBlank.photo || ''}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                        InputProps={{
                                            startAdornment: (
                                                <AddPhotoAlternateIcon color="action" sx={{ mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                
                                {(imagePreview || categoryBlank.photo) && (
                                    <Grid item xs={12}>
                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                            <img
                                                src={imagePreview || categoryBlank.photo || ''}
                                                alt="Category preview"
                                                style={{ maxHeight: 200, maxWidth: '100%' }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                )}
                                
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Сойздать новую категорию
                                    </Button>
                                </Grid>
                                
                                {error && (
                                    <Grid item xs={12}>
                                        <Typography color="error">
                                            {error}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
                
                {/* Список существующих категорий */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Существующие категории
                        </Typography>
                        
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Grid container spacing={2}>
                                {categories.length === 0 ? (
                                    <Grid item xs={12}>
                                        <Typography>Категории не найдены</Typography>
                                    </Grid>
                                ) : (
                                    categories.map(category => (
                                        <Grid item xs={12} sm={6} key={category.id}>
                                            <Card>
                                                {category.photo && (
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={category.photo}
                                                        alt={category.name}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                <CardContent>
                                                    <Typography gutterBottom variant="h6">
                                                        {category.name}
                                                    </Typography>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDelete(category.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}