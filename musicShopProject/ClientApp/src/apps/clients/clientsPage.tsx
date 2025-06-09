import React, { useEffect, useState } from "react";
import { 
    Box, 
    TextField, 
    Button, 
    CircularProgress, 
    Typography,
    Paper,
    Tab,
    Tabs
} from "@mui/material";
import { UserProvider } from "../../domain/user/userProvider";
import { toUser, toUsers, User } from "../../domain/user/user";
import { format } from "date-fns";
import { OrderPage } from "../orders/orderPage";
import { ClientOrderTab } from "./clientOrderTab";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function ClientsPage() {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSearch = async () => {
        if (!phoneNumber.trim()) {
            setError("Введите номер телефона");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await UserProvider.getUserByPhoneNumber(phoneNumber);
            if (response) {
                setUser(toUser(response));
                setTabValue(0);
            } else {
                setError("Клиент не найден");
                setUser(null);
            }
        } catch (err) {
            setError("Ошибка при поиске клиента");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Box sx={{ p: 2, marginTop: 2 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    label="Номер телефона"
                    variant="outlined"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите номер телефона"
                    fullWidth
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? <CircularProgress size={24} /> : "Найти"}
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {user && (
                <Paper sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange} 
                            aria-label="user tabs"
                        >
                            <Tab label="Основная информация" {...a11yProps(0)} />
                            <Tab label="Дополнительно" {...a11yProps(1)} />
                            <Tab label="История заказов" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom>
                            Основная информация
                        </Typography>
                        <Typography>Номер телефона: {user.phoneNumber}</Typography>
                        <Typography>Email: {user.email || "Не указано"}</Typography>
                        
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom>
                            Дополнительная информация
                        </Typography>
                        <Typography>Здесь может быть дополнительная информация о пользователе</Typography>
                        {/* Добавьте дополнительные поля пользователя по мере необходимости */}
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <ClientOrderTab id={user.id} />
                    </TabPanel>
                </Paper>
            )}
        </Box>
    );
}