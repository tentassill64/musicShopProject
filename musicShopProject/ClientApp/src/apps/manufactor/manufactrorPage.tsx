import { useState, useEffect } from "react";
import { 
    Button, 
    TextField, 
    Grid, 
    Paper, 
    Typography, 
    Box, 
    CircularProgress, 
    Card, 
    CardMedia, 
    CardContent, 
    IconButton,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    SelectChangeEvent
} from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotifications } from "@toolpad/core";
import { Manufacturer } from "../../domain/manufactures/manufactured";
import { ManufactorBlank } from "../../domain/manufactures/manufactorBlank";
import { ManufacturerProvider } from "../../domain/manufactures/manufacturerProvider";
import { Countries } from "../../domain/manufactures/countries";

export function ManufactorPage() {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [manufactorBlank, setManufactorBlank] = useState<ManufactorBlank>(ManufactorBlank.getEmpty());
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const notification = useNotifications();

    const loadManufacturers = async () => {
        try {
            setLoading(true);
            const loadedManufacturers = await ManufacturerProvider.getManufacturer();
            setManufacturers(loadedManufacturers);
        } catch (e) {
            console.error("Failed to load manufacturers", e);
            setError("Failed to load manufacturers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadManufacturers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setManufactorBlank(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'logo') {
            setImagePreview(value || null);
        }
    };

    const handleCountryChange = (e: SelectChangeEvent<Countries>) => {
        const country = e.target.value as Countries;
        setManufactorBlank(prev => ({
            ...prev,
            country
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!manufactorBlank.name) {
            setError("Name is required");
            return;
        }

        if (!manufactorBlank.country) {
            setError("Country is required");
            return;
        }

        try {
            // Здесь должен быть вызов API для сохранения производителя
            // const result = await ManufacturerProvider.saveManufacturer(manufactorBlank);
            
            // Временная имитация успешного сохранения
            const result = { isSuccess: true };
            
            if(result.isSuccess) {
                notification.show("Успешно", {
                    severity: 'success',
                    autoHideDuration: 3000
                });
            } else {
                notification.show("Ошибка при сохранении", {
                    severity: 'error',
                    autoHideDuration: 3000
                });
            }

            setManufactorBlank(ManufactorBlank.getEmpty());
            setImagePreview(null);
            setError(null);
            await loadManufacturers();
        } catch (e) {
            console.error("Failed to save manufacturer", e);
            setError("Failed to save manufacturer");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // Здесь должен быть вызов API для удаления производителя
            // await ManufacturerProvider.deleteManufacturer(id);
            
            await loadManufacturers();
        } catch (e) {
            console.error("Failed to delete manufacturer", e);
            setError("Failed to delete manufacturer");
        }
    };

    // Получаем массив стран для Select
    const countryEntries = Object.entries(Countries)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => ({
            value: value as Countries,
            label: Countries.getDisplayName(value as Countries)
        }));

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Производители
            </Typography>
            
            <Grid container spacing={3}>
                {/* Форма создания нового производителя */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Добавить нового производителя
                        </Typography>
                        
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Название производителя"
                                        name="name"
                                        value={manufactorBlank.name || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Ссылка на логотип"
                                        name="logo"
                                        value={manufactorBlank.logo || ''}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/logo.png"
                                        InputProps={{
                                            startAdornment: (
                                                <AddPhotoAlternateIcon color="action" sx={{ mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="country-label">Страна</InputLabel>
                                        <Select
                                            labelId="country-label"
                                            label="Страна"
                                            value={manufactorBlank.country || ''}
                                            onChange={handleCountryChange}
                                            required
                                        >
                                            {countryEntries.map(({value, label}) => (
                                                <MenuItem key={value} value={value}>
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                {(imagePreview || manufactorBlank.logo) && (
                                    <Grid item xs={12}>
                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                            <img
                                                src={imagePreview || manufactorBlank.logo || ''}
                                                alt="Превью логотипа"
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
                                        size="large"
                                    >
                                        Создать производителя
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
                
                {/* Список существующих производителей */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Список производителей
                        </Typography>
                        
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Grid container spacing={2}>
                                {manufacturers.length === 0 ? (
                                    <Grid item xs={12}>
                                        <Typography>Производители не найдены</Typography>
                                    </Grid>
                                ) : (
                                    manufacturers.map(manufacturer => (
                                        <Grid item xs={12} sm={6} key={manufacturer.id}>
                                            <Card sx={{ height: '100%' }}>
                                                {manufacturer.logo && (
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={manufacturer.logo}
                                                        alt={manufacturer.name}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                <CardContent>
                                                    <Typography gutterBottom variant="h6">
                                                        {manufacturer.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Страна: {Countries.getDisplayName(manufacturer.country)}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(manufacturer.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
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