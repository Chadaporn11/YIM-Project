import React, { useState } from 'react';
import './Menubar.css';
import { Link, useNavigate } from 'react-router-dom';
import { PieChartOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Avatar } from 'antd';

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

const itemstop: MenuProps['items'] = [
    getItem(<Link to='/'>My ToDo List</Link>, 'mytodolist', <PieChartOutlined />),
    getItem(<Link to='/user-list'>User</Link>, 'user', <UserOutlined />),
];
const itemsend: MenuProps['items'] = [
    getItem('Log out', 'logout', <LoginOutlined />),
];

const Menubar = () => {

    const navigate = useNavigate();

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e.key);
        if(e.key === 'logout'){
            window.location.reload()
            navigate('/login')
            localStorage.clear();
        }
    };
    return (
        <div className='menubar-container'>
            <div className='menubar-img'>
                <Avatar
                    size={120}
                    icon={<UserOutlined />} />
            </div >
            <div className='menubar-itemtop'>
                <div className='item'>
                    <Menu
                        onClick={onClick}
                        style={{ backgroundColor: '#063970', color: 'white', float: 'inline-start' }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        items={itemstop}
                    />

                </div>
            </div>
            <div className='menubar-itemend'>
                <div className='item'>
                    <Menu
                        onClick={onClick}
                        style={{ backgroundColor: '#063970', color: 'white', float: 'inline-end' }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        items={itemsend}
                    />

                </div>
            </div>


        </div>

    )
}

export default Menubar;


