import React, { useEffect, useState } from 'react';
import './CreateUser.css';
import { useNavigate } from 'react-router-dom';
//models type
import { userInterface } from '../../models/IUser';
//function
import { getUser, updateUser } from '../functions/user';
//ant design
import {
    LockOutlined,
    PhoneOutlined,
    UserAddOutlined,
    PushpinOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Upload,
    message,
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Col, Row } from 'antd';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};


const EditUser = () => {

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [dataget, setDataget] = useState<Partial<userInterface>>({});
    const [user, setUser] = useState<Partial<userInterface>>({});
    const navigate = useNavigate();

    const handleChangeImage: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImageUrl(url);

            });
        }
    };

    const uploadButton = (
        <div style={{ fontSize: 50 }}>
            {loading ? <LoadingOutlined /> : <UserAddOutlined />}
            {/* <div style={{ marginTop: 8 }}>Upload</div> */}
        </div>
    );

    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const name = event.target.id as keyof typeof dataget;
        const { value } = event.target;
        setDataget({
            ...dataget,
            [name]: value,
        });
    }
    const handleSubmit = () => {
        let data = {
            username: dataget.username,
            password: dataget.password,
            phone_number: dataget.phone_number,
            address: dataget.address,
            img: imageUrl,
        }
        const edit_user = localStorage.getItem('edit_user')
        const token = localStorage.getItem('access_token')
        updateUser(token, edit_user, data)
            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                alert(res.msg)
                localStorage.removeItem('edit_user')
                navigate('/user-list')
            }).catch((err) => {
                console.log(err)
            })

    }
    console.log('edit_user', dataget)
    console.log(user)
    const handleCancel = () => {
        localStorage.removeItem('edit_user')
        navigate('/user-list')

    }
    const loadData = () => {
        const token = localStorage.getItem('access_token')
        const uid = localStorage.getItem('edit_user')
        getUser(token, uid)
            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                setDataget(res)
                setImageUrl(res.img)
            }).catch((err) => {
                console.log(err)
            })
    }
    console.log('data', dataget)

    useEffect(() => {
        loadData()
    }, [])

    return (
        <div className='container'>
            <Row>
                <Col style={{ marginLeft: "4%", marginTop: "5%" }} xs={4} sm={6} md={8} lg={10} xl={12}>
                    <h3>Add User</h3>
                </Col>
            </Row>
            <div className='container-from'>


                <Form
                    name="wrap"
                    labelCol={{ flex: '20px' }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{ flex: 1 }}
                    colon={false}
                >

                    <Form.Item>
                        <Upload
                            name="img"
                            id='img'
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={handleChangeImage}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item label={<UserAddOutlined />} id="use" name="username">
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            placeholder={dataget.username}
                            value={dataget.username}
                            onChange={handleInputChange}
                        />
                    </Form.Item>

                    <Form.Item label={<PhoneOutlined />} name="phonenumber">
                        <Input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            value={dataget.phone_number}
                            onChange={handleInputChange}

                            placeholder={dataget.phone_number} />
                    </Form.Item>

                    <Form.Item label={<PushpinOutlined />} name="address">
                        <Input
                            type="text"
                            name="address"
                            id="address"
                            value={dataget.address}
                            onChange={handleInputChange}

                            placeholder={dataget.address} />
                    </Form.Item>

                    <Form.Item
                        label={<LockOutlined />}
                        name="password"
                    >
                        <Input.Password
                            type="text"
                            name="password"
                            id="password"
                            value={dataget.password}
                            onChange={handleInputChange}

                            placeholder="password" />
                    </Form.Item>

                    <Form.Item
                        label={<LockOutlined />}
                        name="confirmpassword"
                    >
                        <Input.Password
                            type="text"
                            name="confirmpassword"
                            id="confirmpassword"
                            value="confirmpassword"
                            onChange={handleInputChange}

                            placeholder="confirmpassword" />
                    </Form.Item>
                    <Form.Item>
                        <div className='button-size'>
                            <div className='button-cancel'>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={handleCancel}>
                                    cancel
                                </Button>
                            </div>
                            <div className='button-submit'>
                                <Button
                                    onClick={handleSubmit}
                                    type="primary"
                                    htmlType="submit">
                                    Submit
                                </Button>
                            </div>
                        </div>

                    </Form.Item>

                </Form>


            </div>

        </div>

    );
}


export default EditUser;