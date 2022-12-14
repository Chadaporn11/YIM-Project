import React, { useEffect, useState } from 'react';
import './Menubar.css';
import { Link, useNavigate } from 'react-router-dom';
import { PieChartOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Layout, MenuProps } from 'antd';
import { Menu, Avatar } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { getUser } from '../functions/user';



type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const itemsuser: MenuProps['items'] = [

    getItem(<Link to='/'>My ToDo List</Link>, 'mytodolist', <PieChartOutlined />),
];
const itemsadmin: MenuProps['items'] = [

    getItem(<Link to='/'>My ToDo List</Link>, 'mytodolist', <PieChartOutlined />),
    getItem(<Link to='/user-list'>User</Link>, 'user', <UserOutlined />),
];
const itemsend: MenuProps['items'] = [
    getItem('Log out', 'logout', <LoginOutlined />),
];

const Menubar = () => {

    const navigate = useNavigate();

    const [Users, setUsers] = useState('')

    const roles = localStorage.getItem('roles')


    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e.key);
        console.log("useridddddddddddddddddd", Users)
        if (e.key === 'logout') {
            navigate('/')
            localStorage.clear();
            window.location.reload()

        }
    };

    const loadData = async () => {
        const token = localStorage.getItem('access_token')
        const userid = localStorage.getItem('user')
        getUser(token, userid)
            .then((response) => response.json())
            .then((res) => {
                if (res) {
                    setUsers(res.img);

                } else {
                    console.log('else')
                }
            });
    };


    useEffect(() => {
        loadData();

    }, []);




    return (


        <Layout hasSider style={{backgroundColor: '#063970'}}>
            <Sider 
                style={{
                    overflow: 'auto',
                    minHeight: '90vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: '#06367a',
                }}
            >
                <div className='menubar-img'>
                    {!Users
                        ? <Avatar
                            size={140}
                            icon={<UserOutlined />} />
                        : <Avatar
                            size={140}
                            src={Users} />
                    }
                </div >

                <div className='StyledMenuContainer'>
                {roles === 'user'
                    ? <Menu
                        onClick={onClick}
                        style={{ backgroundColor: '#06367a', color: 'white', float: 'inline-start' }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        items={itemsuser}
                    />
                    : <Menu
                        onClick={onClick}
                        style={{ backgroundColor: '#06367a', color: 'white', float: 'inline-start' }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        items={itemsadmin}
                    />}
                <Menu 
                    onClick={onClick}
                    style={{ backgroundColor: '#06367a', color: 'white', float: 'inline-end' }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    items={itemsend}
                />
                </div>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200 }}>

            </Layout>
        </Layout>
    )
}

export default Menubar;




