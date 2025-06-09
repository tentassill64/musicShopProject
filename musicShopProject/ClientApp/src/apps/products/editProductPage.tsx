import React, { ChangeEvent, useEffect, useState } from "react";
import { 
    Box, Divider, Typography, TextField, Checkbox, FormControlLabel, 
    Button, IconButton, List, ListItem, Card, CardContent, Grid, 
    Avatar, InputAdornment, Paper 
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ProductBlank } from "../../domain/products/productBlank";
import { Category } from "../../domain/products/productsCategories/category";
import { CategoryProvider } from "../../domain/products/productsCategories/categoryProvider";
import { CSelect } from "../../sharedComponents/select/cSelect";
import { ProductProvider } from "../../domain/products/productProvider";
import { ProductStatus } from "../../domain/products/enum/ProductStatus";
import { useNotifications } from "@toolpad/core";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { SiteLinks } from "../../tools/links";
import { CancelIconButton } from "../../sharedComponents/buttons/cancelIconButton";
import { Manufacturer } from "../../domain/manufactures/manufactured";
import { ManufacturerProvider } from "../../domain/manufactures/manufacturerProvider";
import { Countries } from "../../domain/manufactures/countries";


export function EditProductPage() {
    const { productid } = useParams();
    const [product, setProduct] = useState<ProductBlank>(ProductBlank.getEmpty());
    const [categories, setCategories] = useState<Category[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [filteredManufacturers, setFilteredManufacturers] = useState<Manufacturer[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
    const [newPhotoUrl, setNewPhotoUrl] = useState<string>("");

    const navigate = useNavigate();
    const notification = useNotifications();

    useEffect(() => {
        loadPage();
    }, []);

    useEffect(() => {
        const filtered = manufacturers.filter(manuf =>
            manuf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            Countries.getDisplayName(manuf.country).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredManufacturers(filtered);
    }, [searchTerm, manufacturers]);

    async function loadPage() {
        try {
            const [categories, manufacturers] = await Promise.all([
                CategoryProvider.getCategories(),
                ManufacturerProvider.getManufacturer()
            ]);

            setCategories(categories);
            setManufacturers(manufacturers);
            setFilteredManufacturers(manufacturers);

            if (productid) {
                const product = await ProductProvider.getProduct(productid);
                if (product) {
                    const productBlank = ProductBlank.toProductBlank(product);
                    setProduct(productBlank);
                    
                    const category = categories.find(c => c.id === product.categoryId);
                    setSelectedCategory(category ?? null);
                    
                    const manufacturer = manufacturers.find(m => m.id === product.manufacturer.id);
                    setSelectedManufacturer(manufacturer ?? null);
                } else {
                    notification.show("Продукт не найден", { severity: 'error' });
                    navigate(SiteLinks.products);
                }
            }
        } catch (error) {
            notification.show("Ошибка загрузки данных", { severity: 'error' });
            console.error(error);
        }
    }

    function changeName(e: ChangeEvent<HTMLInputElement>) {
        setProduct(state => ({...state, name: e.target.value }));
    }

    function changeDescription(e: ChangeEvent<HTMLInputElement>) {
        setProduct(state => ({...state, description: e.target.value }));
    }

    function changePrice(e: ChangeEvent<HTMLInputElement>) {
        setProduct(state => ({...state, price: parseFloat(e.target.value) }));
    }

    function changeWeight(e: ChangeEvent<HTMLInputElement>) {
        setProduct(state => ({...state, weight: parseFloat(e.target.value) }));
    }

    function changeQuantity(e: ChangeEvent<HTMLInputElement>) {
        setProduct(state => ({...state, quantity: parseInt(e.target.value) }));
    }

    function changePhotoUrl(e: ChangeEvent<HTMLInputElement>) {
        setNewPhotoUrl(e.target.value);
    }

    function addPhotoUrl() {
        if (newPhotoUrl.trim()) {
            setProduct(state => ({
                ...state,
                images: [...state.images, newPhotoUrl]
            }));
            setNewPhotoUrl("");
        }
    }

    function deleteImage(url: string) {
        setProduct(state => ({
            ...state,
            images: state.images.filter(imgUrl => imgUrl !== url)
        }));
    }

    function changeCategory(category: Category | null) {
        if (category) {
            setSelectedCategory(category);
            setProduct(state => ({...state, categoryId: category.id }));
        }
    }

    function changeStatus(newStatus: ProductStatus | null) {
        setProduct(state => ({...state, status: newStatus ?? ProductStatus.TemporarilyOutOfSale }));
    }

    function handleManufacturerSelect(manufacturer: Manufacturer) {
        setSelectedManufacturer(manufacturer);
        setProduct(state => ({...state, manufacturerId: manufacturer.id }));
    }

    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearchTerm(e.target.value);
    }

    function changeIsHidden(e: ChangeEvent<HTMLInputElement>) {
        setProduct(state => ({...state, isHidden: e.target.checked }));
    }

    async function saveProduct() {
        try {
            const response = await ProductProvider.saveProduct(product);
            
            if (response.isSuccess) {
                notification.show("Продукт успешно сохранен", { 
                    severity: 'success',
                    autoHideDuration: 3000
                });
                navigate(SiteLinks.products);
            } else {
                notification.show(response.errorsString, { 
                    severity: 'error',
                    autoHideDuration: 3000
                });
            }
        } catch (error) {
            notification.show("Ошибка при сохранении продукта", { 
                severity: 'error',
                autoHideDuration: 3000
            });
            console.error(error);
        }
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h4" ml={2} mt={2}>
                    {productid ? "Редактирование продукта" : "Создание продукта"}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate(SiteLinks.products)}
                >
                    Вернуться
                </Button>
            </Box>
            
            <Divider />
            <Box p={2}>
                <TextField
                    name="name"
                    label="Название"
                    value={product.name || ""}
                    onChange={changeName}
                    fullWidth
                    margin="normal"
                />
                
                <TextField
                    name="description"
                    label="Описание"
                    value={product.description || ""}
                    onChange={changeDescription}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />
                
                {/* Секция выбора производителя */}
                <Typography variant="h6" mt={2} mb={1}>Производитель</Typography>
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Поиск производителя..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    
                    {selectedManufacturer && (
                        <Box sx={{ mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                            <Typography variant="subtitle1">Выбранный производитель:</Typography>
                            <Box display="flex" alignItems="center" mt={1}>
                                {selectedManufacturer.logo && (
                                    <Avatar 
                                        src={selectedManufacturer.logo} 
                                        alt={selectedManufacturer.name}
                                        sx={{ width: 40, height: 40, mr: 2 }}
                                    />
                                )}
                                <Box>
                                    <Typography fontWeight="bold">{selectedManufacturer.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {Countries.getDisplayName(selectedManufacturer.country)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    
                    <Grid container spacing={2}>
                        {filteredManufacturers.map(manufacturer => (
                            <Grid item xs={12} sm={6} md={4} key={manufacturer.id}>
                                <Card 
                                    onClick={() => handleManufacturerSelect(manufacturer)}
                                    sx={{ 
                                        cursor: 'pointer',
                                        border: selectedManufacturer?.id === manufacturer.id 
                                            ? '2px solid #1976d2' 
                                            : '1px solid #e0e0e0',
                                        '&:hover': {
                                            boxShadow: 3,
                                        }
                                    }}
                                >
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        {manufacturer.logo && (
                                            <Avatar 
                                                src={manufacturer.logo} 
                                                alt={manufacturer.name}
                                                sx={{ width: 40, height: 40, mr: 2 }}
                                            />
                                        )}
                                        <Box>
                                            <Typography fontWeight="bold">{manufacturer.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {Countries.getDisplayName(manufacturer.country)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
                
                <CSelect
                    options={categories}
                    label="Категория"
                    value={selectedCategory}
                    getOptionValue={category => category.id}
                    getOptionLabel={category => category.name}
                    onChange={changeCategory}
                />
                
                <TextField
                    name="price"
                    label="Цена"
                    value={product.price || ""}
                    onChange={changePrice}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                
                <TextField
                    name="weight"
                    label="Вес"
                    value={product.weight || ""}
                    onChange={changeWeight}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                
                <CSelect
                    options={ProductStatus.getArray()}
                    label="Статус"
                    value={product.status}
                    getOptionValue={status => status}
                    getOptionLabel={status => ProductStatus.getDisplayName(status)}
                    onChange={changeStatus}
                />
                
                <FormControlLabel
                    control={
                        <Checkbox
                            name="isHidden"
                            checked={product.isHidden || false}
                            onChange={changeIsHidden}
                        />
                    }
                    label="Скрытый"
                />
                
                <TextField
                    name="quantity"
                    label="Количество"
                    value={product.quantity || ""}
                    onChange={changeQuantity}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                
                <Box display="flex" alignItems="center" margin="normal">
                    <TextField
                        name="photoUrl"
                        label="Ссылка на фотографию"
                        value={newPhotoUrl}
                        onChange={changePhotoUrl}
                        fullWidth
                        margin="normal"
                    />
                    <IconButton onClick={addPhotoUrl} color="primary">
                        <AddIcon />
                    </IconButton>
                </Box>
                
                {product.images && product.images.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1">Ссылки на фотографии:</Typography>
                        <List>
                            {product.images.map((url, index) => (
                                <Box key={index} display="flex" justifyContent="space-between">
                                    <ListItem>{url}</ListItem>
                                    <CancelIconButton onClick={() => deleteImage(url)} />
                                </Box>
                            ))}
                        </List>
                    </Box>
                )}
                
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={saveProduct}
                    sx={{ mt: 2 }}
                >
                    Сохранить
                </Button>
            </Box>
        </Box>
    );
}