import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ItemList.css'
import { toast } from 'react-toastify';
//function
import { deleteTask, updateTask, createTask } from '../functions/task';

//models
import { TaskInterface } from '../../models/ITask';
//ant design
import { Col, Row, Card, List, Button } from 'antd';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
type ItemListProps = {
    task: TaskInterface[]
    loadData: () => void
    setTask: React.Dispatch<React.SetStateAction<TaskInterface[]>>
}

const ItemList = (props: ItemListProps) => {


    const params = useParams();
    const { task, loadData, setTask } = props;
    const groupid = params.id;
    const userid = localStorage.getItem('user')
    const [addTask, setaddTask] = useState<Partial<TaskInterface>>({});
    const [editTask, setEditTask] = useState<Partial<TaskInterface>>({});
    const [status, setStatus] = useState(false);

    const handleClick = (item: TaskInterface) => {
        const { id, state } = item
        const data = {
            id: id,
            state: !state,
        }
        updateTask(data)
            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                loadData()
            }).catch((err) => {
                console.log(err)
            })
    }

    const handleRemoveTask = (tid: number) => {
        const token = localStorage.getItem('access_token')
        deleteTask(token, tid)
            .then((response) => response.json())
            .then((res) => {
                toast.success('Delete Task success')
                console.log(res)
                loadData()
            }).catch((err) => {
                toast.error(err)
                console.log(err);
            })
    }

    const handleEditTask = (item: any) => {
        setStatus(true)
        setEditTask({ id: item.id, name: item.name })
    }
    console.log('editTask', editTask)

    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const name = event.target.id as keyof typeof addTask;
        const { value } = event.target;

        setaddTask({
            ...addTask,
            [name]: value,
        });
        console.log('addtask', addTask)



    }

    const handleInputEditChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const name = event.target.id as keyof typeof editTask;
        const { value } = event.target;

        setEditTask({
            ...editTask,
            [name]: value,
        })
        console.log('edittask', editTask)


    }


    const handleSubmit = () => {
        let editData = {
            id: editTask.id,
            name: editTask.name,
        }
        let addData = {
            name: addTask.name,
            userId: typeof userid === "string" ? parseInt(userid) : 0,
            groupId: params.id,
            state: true,
        }
        if (status === true) {
            updateTask(editData)
                .then((response) => response.json())
                .then((res) => {
                    console.log(res)
                    toast.success(`Update ${res.name} Task success`)
                    setStatus(false)
                    loadData()
                    ClearForm()

                }).catch((err) => {
                    toast.error(err)
                    console.log(err)
                })


        } else {
            createTask(addData)
                .then((response) => response.json())
                .then((res) => {
                    toast.success(`Create ${res.name} Task Success`)
                    loadData()
                    console.log(res)
                    ClearForm()

                }).catch((err) => {
                    toast.error(err)
                    console.log(err)
                })
        }

    }

    const ClearForm = () => {
        setEditTask({});
        setaddTask({});
    };

    useEffect(() => {
        loadData()

    }, [])

    return (
        <>
            {status === false
                ? <input className='input'
                    id="name"
                    value={addTask.name || ''}
                    type="text"
                    onChange={handleInputChange}>
                </input>
                : <input className='input'
                    id="name"
                    value={editTask.name || ''}
                    type="text"
                    onChange={handleInputEditChange}>
                </input>}

            <Button type="primary" size={'large'} onClick={handleSubmit}>
                Save
            </Button>
            <Card style={{ width: 850 }}>
                <List
                    grid={{
                        lg: 0
                    }}
                    bordered={false}
                    dataSource={task}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Card key={index} style={{ backgroundColor: "#f5f9fd", width: 750, marginBottom: "4%", }}>
                                <Row>
                                    <Col style={{ textAlign: 'left' }} span={12}>
                                        <p>{item.name}</p>
                                    </Col>
                                    <Col style={{ textAlign: 'right' }} span={12}>
                                        <button className='icon'
                                            disabled={false} onClick={() => handleClick(item)}>
                                            <CheckOutlined />
                                        </button>
                                        <button className='icon'
                                            disabled={item.state} onClick={() => handleEditTask(item)}>
                                            <EditOutlined />
                                        </button>
                                        <button className='icon'
                                            disabled={item.state} onClick={() => handleRemoveTask(item.id)}>
                                            <DeleteOutlined />
                                        </button>



                                    </Col>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>

        </>
    );
}

export default ItemList;