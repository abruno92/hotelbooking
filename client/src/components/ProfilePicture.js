import React, {Component} from 'react';
import defaultPic from '../images/defaultAvatar.jpg';
import {FaCamera} from 'react-icons/fa';
import './user.css'
import {UserService} from "../services/user";

export default class ProfilePicture extends Component {
    constructor(props) {
        super(props);

        this.userId = props.userId;

        this.state = {
            profileImg: '',
        }
    }

    async handleImageChange(e) {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === FileReader.DONE) {
                this.setState({
                    profileImg: reader.result
                });
            }
        }

        reader.readAsDataURL(e.target.files[0])

        await this.updateImage();
    }

    async updateImage() {
        const formPicture = document.getElementById('formPicture');
        const formData = new FormData(formPicture);

        let response;
        try {
            response = await UserService.changeProfilePicture(this.userId, formData);
        } catch (e) {
            if (e.response) {
                console.log(e.response.data.error);
            } else {
                console.log(e);
            }
        }

        if (response) {
            if (response.status === 200) {
                console.log("Profile picture changed successfully");
            }
        }
    }

    componentDidMount() {
        UserService.getProfilePicture(this.userId).then(response => {
            this.setState({
                profileImg: response,
            })
        });
    }

    render() {
        const {profileImg} = this.state;

        return (
            <div className="container">
                <img src={profileImg || defaultPic} alt="hi" className="image" />
                <div className="overlay">
                    <label className="custom-file-upload">
                        <div className="icon">
                            <form id='formPicture' encType="multipart/form-data">
                                <input type="file" name="picture" id="input" accept="image/*"
                                       onChange={this.handleImageChange.bind(this)}/>
                            </form>
                            <FaCamera style={{color: "#88BDBC"}}/>
                        </div>
                    </label>
                </div>
            </div>
        )
    }
}