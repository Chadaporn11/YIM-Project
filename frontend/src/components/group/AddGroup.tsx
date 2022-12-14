import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AddGroup.css';
import { toast } from 'react-toastify';
//models
import { GroupInterface } from '../../models/IGroup';
//function
import { creategroup } from '../functions/group';
//ant design
import { Button, Input, Row } from 'antd';
import { LeftCircleFilled } from '@ant-design/icons';


const AddGroup = () => {

    const [Group, setGroup] = useState<Partial<GroupInterface>>({});
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof Group;
        const { value } = event.target;
        setGroup({ ...Group, [id]: value });
    };

    const Submit = () => {

        const user = localStorage.getItem("user");
        let data = {
            name: Group.name,
            userId: user,
        };
        console.log(data)
        creategroup(data)
            .then((response) => response.json())
            .then((res) => {
                if (res) {
                    console.log(res)
                    toast.success("Add Group Success")
                    navigate('/')
                    
                } else {
                    console.log(res)
                    toast.error("Add Group fail")
                }
            });

    }


    console.log(Group);

    return (
        <div className='addgroup-container'>
            <Row>
                <div className='addgroup-btn-back'>
                    <Link to='/'>
                        <LeftCircleFilled style={{ fontSize: '40px', color: '#08c' }} />
                    </Link>
                </div>
            </Row>
            <Row>
                <div className='addgroup-header'>
                    <h2 className='title'>Add Group</h2>
                </div>

            </Row>
            <Row>
                <div className='addgroup-content'>
                    <div className="addgroup-content-input">
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            value={Group.name}
                            onChange={handleInputChange}
                            style={{ marginLeft: "4%" }}
                            placeholder=" Memes" />
                    </div>
                    <div className="addgroup-content-btn">
                        <Button onClick={Submit} type="primary" block>
                            Save
                        </Button>
                    </div>
                </div>
            </Row>
        </div>
    )
}

export default AddGroup;