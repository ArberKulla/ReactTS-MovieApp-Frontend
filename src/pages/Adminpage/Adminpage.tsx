import "./Adminpage.css";
import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userRole: string;
  createdDate: string;
};

type WatchlistItem = {
  id: number;
  movieId: string;
  title: string;
  description: string;
  rating: number;
  type: string;
  releaseYear: string;
  posterUrl: string;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [watchlists, setWatchlists] = useState<Record<number, WatchlistItem[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const { token, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Role:", role);
    if (!token || role!== "ROLE_ADMIN") {
      toast.error("Access denied.");
      navigate("/");
      return;
    }
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users.");
    }
  };

  const fetchWatchlist = async (userId: number) => {
    if (watchlists[userId]) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/watchlists/get/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWatchlists((prev) => ({
        ...prev,
        [userId]: res.data.content || [],
      }));
    } catch (error) {
      toast.error("Failed to load watchlist.");
    }
  };

  const handleExpand = async (expanded: boolean, user: User) => {
    const newSet = new Set(expandedRows);
    if (expanded) {
      await fetchWatchlist(user.id);
      newSet.add(user.id);
    } else {
      newSet.delete(user.id);
    }
    setExpandedRows(newSet);
  };

  const showEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.put(
        `http://localhost:8080/api/user/${editingUser?.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser?.id ? response.data : u))
      );
      toast.success("User updated successfully.");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const userColumns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Role",
      dataIndex: "userRole",
      render: (role: string) => <Tag color="geekblue">{role}</Tag>,
    },
    {
      title: "Actions",
      render: (_: any, user: User) => (
        <Button type="link" onClick={() => showEditModal(user)}>
          Edit
        </Button>
      ),
    },
  ];

  const watchlistColumns = [
    {
      title: "Poster",
      dataIndex: "posterUrl",
      render: (url: string) => (
        <img
          src={`https://image.tmdb.org/t/p/w200${url}`}
          alt="Poster"
          style={{ width: 50, borderRadius: 4 }}
        />
      ),
      width: 60,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string) => (
        <Tag color={type === "movie" ? "blue" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Year",
      dataIndex: "releaseYear",
    },
    {
      title: "Rating",
      dataIndex: "rating",
    },
  ];

  const expandedRowRender = (user: User) => {
    const list = watchlists[user.id] || [];
    return (
      <Table
        columns={watchlistColumns}
        dataSource={list}
        rowKey="id"
        pagination={false}
        size="small"
      />
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Admin Panel: Users & Watchlists</Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Back
        </Button>
      </div>

      <Table
        columns={userColumns}
        dataSource={users}
        rowKey="id"
        expandable={{
          expandedRowRender,
          rowExpandable: () => true,
          expandedRowKeys: Array.from(expandedRows),
          onExpand: handleExpand,
        }}
        pagination={{ pageSize: 10 }}
        bordered
        className="bg-white rounded-xl"
      />

      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdateUser}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="userRole" label="Role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="USER">USER</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
