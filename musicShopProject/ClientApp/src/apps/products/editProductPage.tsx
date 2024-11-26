import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Divider, Typography, TextField, Select, MenuItem, Checkbox, FormControlLabel, Button, IconButton, List, ListItem } from "@mui/material";
import { useFetcher, useNavigate, useParams } from "react-router-dom";
import { ProductBlank } from "../../domain/products/productBlank";
import { Category } from "../../domain/products/productsCategories/category";
import { CategoryProvider } from "../../domain/products/productsCategories/categoryProvider";
import { CSelect } from "../../sharedComponents/select/cSelect";
import { ProductProvider } from "../../domain/products/productProvider";
import { ProductStatus } from "../../domain/products/enum/ProductStatus";
import { useNotifications } from "@toolpad/core";
import AddIcon from '@mui/icons-material/Add';
import { SiteLinks } from "../../tools/links";
import { CancelIconButton } from "../../sharedComponents/buttons/cancelIconButton";

export function EditProductPage() {
    const { productid } = useParams();
    const [product, setProduct] = useState<ProductBlank>(ProductBlank.getEmpty());
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [newPhotoUrl, setNewPhotoUrl] = useState<string>("");

    const navigate = useNavigate();
    const notification = useNotifications();

    useEffect(() => {
        loadPage();
    }, [])

    async function loadPage() {
        const categories = await CategoryProvider.getCategories();

        const product = await ProductProvider.getProduct(productid ?? "");

        if(product) {
            setProduct(ProductBlank.toProductBlank(product));
            const category = categories.find(cat => cat.id == product.categoryId);
            setSelectedCategory(category ?? null)
            setCategories(categories);
        } else {
            notification.show("Такого продукта нет", {
                severity: 'error',
                autoHideDuration: 3000
            })
            navigate(SiteLinks.home)
        }
    }

    function changeName(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setProduct(state => ({...state,
            name: e.target.value
        }))
    }

    function changeDescription(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setProduct(state => ({...state,
            description: e.target.value
        }))
    }

    function changePrice(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setProduct(state => ({...state,
            price: parseFloat(e.target.value)
        }))
    }

    function changeWeight(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setProduct(state => ({...state,
            weight: parseFloat(e.target.value)
        }))
    }

    function changeQuantity(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setProduct(state => ({...state,
            quantity: parseInt(e.target.value)
        }))
    }

    function changePhotoUrl(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setNewPhotoUrl(e.target.value);
    }

    function addPhotoUrl() {
        if (newPhotoUrl.trim()) {
            setProduct(state => ({...state,
                images: [...state.images, newPhotoUrl]
            }));
            setNewPhotoUrl("");
        }
    }

    function changeCategory(category: Category | null) {
        if(category) {
            setSelectedCategory(category);
        setProduct(state => ({...state, 
            categoryId: category.id
        }))
        }
        
    }

    function changeStatus(newStatus: ProductStatus | null) {
        setProduct(state => ({...state,
            status: newStatus ?? ProductStatus.TemporarilyOutOfSale
        }))
    }

    function changeManufacturer(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setProduct(state => ({...state,
            manufacturer: e.target.value
        }))
    }

    function deleteImage(url: string) {
        setProduct(state => ({
            ...state,
            images: state.images.filter(imgUrl => imgUrl !== url)
        }));
    }

    function changeIsHidden(e: ChangeEvent<HTMLInputElement>) {
        setProduct(state => ({...state,
            isHidden: e.target.checked
        }))
    }

    async function saveProduct() {
        const response = await ProductProvider.saveProduct(product);

        if(response.isSuccess) {
            notification.show("Успешно",
                {
                    severity: 'success',
                    autoHideDuration: 3000
                }
            )
            navigate(SiteLinks.products);
            return;
        }

        notification.show(response.errorsString, {
            severity: 'error',
            autoHideDuration: 3000
        })
    }

    return (
        <Box>
            <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h4" ml={2} mt={2}>
                    {productid ? "Редактирование продукта" : "Создание продукта"}
                </Typography>
                <Button variant="contained" 
                        color="primary"
                        onClick={() => navigate("/products")}>
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
                <TextField
                    name="manufacturer"
                    label="Производитель"
                    value={product.manufacturer || ""}
                    onChange={changeManufacturer}
                    fullWidth
                    margin="normal"
                />
                <CSelect
                    options={categories}
                    label="Категория"
                    value={selectedCategory}
                    getOptionValue = {category => category.id}
                    getOptionLabel={category => category.name}
                    onChange={changeCategory}
                />
                <TextField
                    name="price"
                    label="Цена"
                    value={product.price}
                    onChange={changePrice}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="weight"
                    label="Вес"
                    value={product.weight}
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
                            checked={product.isHidden}
                            onChange={changeIsHidden}
                        />
                    }
                    label="Скрытый"
                />
                <TextField
                    name="quantity"
                    label="Количество"
                    value={product.quantity}
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
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <ListItem key={index}>{url}</ListItem>
                                    <CancelIconButton onClick={() => deleteImage(url)}/>
                                </Box>
                            ))}
                        </List>
                    </Box>
                )}
                <Button variant="contained" 
                        color="primary"
                        onClick={saveProduct}>
                    Сохранить
                </Button>
            </Box>
        </Box>
    );
}
