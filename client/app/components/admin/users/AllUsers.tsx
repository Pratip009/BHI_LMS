import React, { FC, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { MdOutlineEmail } from "react-icons/md";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllUserQuery, useDeleteUserMutation, useUpdateUserRoleMutation } from "@/redux/features/user/userApi";
import { styles } from "../../../styles/style";


type Props = {
    isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
    const { theme } = useTheme();
    const { isLoading, data, refetch } = useGetAllUserQuery({});
    const [deleteUser] = useDeleteUserMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [active, setActive] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState("user");

    // Open delete confirmation popup
    const handleDeleteClick = (userId: string) => {
        setSelectedUserId(userId);
        setOpenDeleteDialog(true);
    };

    // Handle user deletion
    const confirmDeleteUser = async () => {
        if (selectedUserId) {
            try {
                await deleteUser(selectedUserId).unwrap();
                setOpenDeleteDialog(false);
                refetch(); // Refetch users immediately after deletion
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    // Refetch data when component mounts and when deletion occurs
    const handleAddMember = async () => {
        try {
            await updateUserRole({ id: newUserEmail, role: newUserRole }).unwrap();
            setActive(false);
            setNewUserEmail("");
            setNewUserRole("user");
            refetch();
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    useEffect(() => {
        refetch();
    }, [refetch]);


    const columns = [
        { field: "id", headerName: "ID", flex: 0.3 },
        { field: "name", headerName: "Name", flex: 0.5 },
        { field: "email", headerName: "Email", flex: 0.7 },
        { field: "role", headerName: "Role", flex: 0.5 },
        { field: "courses", headerName: "Purchased Courses", flex: 0.3 },
        { field: "created_at", headerName: "Joined At", flex: 0.5 },
        {
            field: "delete",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params: any) => (
                <Button onClick={() => handleDeleteClick(params.row.id)}>
                    <AiOutlineDelete className="dark:text-white text-black" size={20} />
                </Button>
            ),
        },
        {
            field: "email_icon",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => (
                <div className="flex justify-center items-center w-full h-full">
                    <a href={`mailto:${params.row.email}`} className="flex justify-center items-center">
                        <MdOutlineEmail className="dark:text-white text-black" size={20} />
                    </a>
                </div>
            ),
        },
    ];

    const rows: any = [];
    const filteredData = isTeam ? data?.users.filter((user: any) => user.role === "admin") : data?.users;

    filteredData?.forEach((user: any) => {
        rows.push({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            courses: user.courses.length,
            created_at: format(user.createdAt),
        });
    });

    return (
        <div className="mt-[120px]">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    {/* <div className="w-full flex justify-end">
                        <div
                            className={`${styles.button} !w-[200px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                            onClick={() => setActive(!active)}
                        >
                            Add New Member
                        </div>
                    </div> */}
                    <Box
                        m="40px 0 0 0"
                        height="500px"
                        padding="0 0 0 20px"
                        sx={{
                            "& .MuiDataGrid-root": { border: "none", outline: "none" },
                            "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": { color: theme === "dark" ? "#fff" : "#000" },
                            "& .MuiDataGrid-sortIcon": { color: theme === "dark" ? "#fff" : "#000" },
                            "& .MuiDataGrid-row": {
                                color: theme === "dark" ? "#fff" : "#000",
                                borderBottom: theme === "dark" ? "1px solid #ffffff30 !important" : "1px solid #ccc !important",
                            },
                            "& .MuiTablePagination-root": { color: theme === "dark" ? "#fff" : "#000" },
                            "& .MuiDataGrid-cell": { borderBottom: "none" },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: theme === "dark" ? "#3e4396 !important" : "#A4A9FC !important",
                                borderBottom: "none",
                                color: theme === "dark" ? "#000000FF !important" : "#000 !important",
                            },
                            "& .MuiDataGrid-virtualScroller": { backgroundColor: theme === "dark" ? "#1F1A40" : "#F2F0F0" },
                            "& .MuiDataGrid-footerContainer": {
                                color: theme === "dark" ? "#fff" : "#000",
                                borderTop: "none",
                                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                            },
                            "& .MuiCheckbox-root": { color: theme === "dark" ? "#b7ebde !important" : "#000 !important" },
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: "#fff !important" },
                        }}
                    >
                        <DataGrid checkboxSelection rows={rows} columns={columns} />
                    </Box>
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>Are you sure you want to delete this user?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={confirmDeleteUser} color="error">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={active} onClose={() => setActive(false)}>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                    <TextField
                        select
                        label="Role"
                        fullWidth
                        margin="normal"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActive(false)}>Cancel</Button>
                    <Button onClick={handleAddMember} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AllUsers;
