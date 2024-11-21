import React, { useEffect, useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { UserProvider } from "../../domain/user/userProvider";
import { toUsers, User } from "../../domain/user/user";
import { format } from "date-fns";

export function ClientsPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const response = await UserProvider.getUsers();
        setUsers(response);
    }

    return (
        <Box>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Номер телефона</TableCell>
                            <TableCell>Эл. почта</TableCell>
                            <TableCell>День рождения</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.birthDate ? format(user.birthDate, "dd.MM.yyyy") : "Не указано"}  </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
