import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TodoList.css';
import { TaskInterface } from '../../models/ITask';
import ItemList from './ItemList';
import { getTaskGroupByGid, updateTask } from '../functions/task';
//ant design
import { Button, Col, Row, Input } from 'antd';
import { LeftCircleFilled } from '@ant-design/icons';


const TodoList = () => {
    const params = useParams();
    const [task, setTask] = useState<Partial<TaskInterface>>({})
    const [taskitem, setTaskitem] = useState<TaskInterface[]>([]);
    const [itemlist, setItemlist] = useState<TaskInterface[]>([]);


    console.log('params', params);
    const loadData = () => {
        getTaskGroupByGid(params.id)
            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                setTaskitem(res.data)
            }).catch((err) => {
                console.log(err.response.data);
            })
    }
    console.log('task', task)
    const handleChangeInput = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof task;
        const { value } = event.target;
        console.log('hello')
        setTask({ ...task, [id]: value });

    }
    console.log('changetask', task)
    const handleChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof task;
        const { value } = event.target;
        console.log('check', itemlist)
        setItemlist({ ...itemlist, [id]: value });
    }

    const handleSave = () => {
        const user = localStorage.getItem('user');
        const groupid = params.id;
        if (itemlist.length > 0) {
            console.log("have itemlist");

        } else {
            console.log("don't have itemlist");
        }

    }

    useEffect(() => {
        loadData();
    }, []);
    console.log('todolist', itemlist)

    return (
        <div className='container'>
            <Row>
                <Col style={{ marginLeft: "4%", marginTop: "5%" }} xs={2} sm={4} md={6} lg={8} xl={10}>
                    <h3>Keynotes files</h3>
                </Col>
                <Col style={{ textAlign: 'right', marginRight: "4%", marginTop: "5%" }} xs={2} sm={4} md={6} lg={8} xl={10}>
                    <Link to='/'>
                        <LeftCircleFilled style={{ fontSize: '40px', color: '#08c' }} />

                    </Link>
                </Col>
            </Row>
            <div className='container-list'>
                <div>
                    <h3>To Do List</h3>
                    <div className='item-save'>
                        <input
                            id="name"
                            value={task.name}
                            onChange={handleChangeInput}
                            type="text" />

                        <Button type="primary" size={'large'} onClick={handleSave}>
                            Save
                        </Button>

                        <ItemList
                            taskitem={taskitem}
                            loadData={loadData}
                            handleChangeInput={handleChangeInput}
                            setTaskitem={setTaskitem}
                            setItemlist={setItemlist}
                            itemlist={itemlist} />

                    </div>
                </div>
            </div>
        </div >




    );
}


export default TodoList;

{/* <UserAddOutlined /> */ }