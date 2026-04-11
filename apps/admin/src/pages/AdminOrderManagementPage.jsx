import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Badge } from 'flowbite-react';
import { Link } from 'react-router-dom';

const AdminOrderManagementPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = () => {
        setLoading(true);
        // This endpoint will return all orders because we are logged in as an admin
        axios.get('/api/orders/')
            .then(response => {
                setOrders(response.data.results || response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching orders", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center p-10"><Spinner size="xl" /></div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Orders</h1>
            </div>
            <div className="overflow-x-auto">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Order ID</Table.HeadCell>
                        <Table.HeadCell>Customer</Table.HeadCell>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Total</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Tracking ID</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Details</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {orders.map(order => (
                            <Table.Row key={order.id}>
                                <Table.Cell className="font-medium">#{order.id}</Table.Cell>
                                <Table.Cell>{order.customer}</Table.Cell>
                                <Table.Cell>{new Date(order.created_at).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>₹{order.total_amount}</Table.Cell>
                                <Table.Cell><Badge color="info">{order.status}</Badge></Table.Cell>
                                <Table.Cell>{order.tracking_id || 'N/A'}</Table.Cell>
                                <Table.Cell>
                                    {/* We will create this detail/edit page next */}
                                    <Button size="xs" as={Link} to={`/admin/orders/${order.id}`}>
                                        View / Edit
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
};

export default AdminOrderManagementPage;