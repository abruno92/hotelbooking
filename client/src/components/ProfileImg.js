import React, { Component } from 'react';
import defaultPic from '../images/defaultAvatar.jpg';
import {FaCamera} from 'react-icons/fa';
import './user.css'

export default class ProfileImage extends Component {
    state = {
        profileImg: '',
    }

    imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2) {
                this.setState({profileImg: reader.result})
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    render() {
        const {profileImg} = this.state;

        return (
                <div className="container">
                    <img src={profileImg || defaultPic} alt="hi" className="image"/>
                    <div className="overlay">
                        <label className="custom-file-upload">
                            <div className="icon">
                                <input type="file" name="image-upload" id="input" accept="image/*" onChange={this.imageHandler}/>
                                <FaCamera style={{color:"#88BDBC"}}/>
                            </div>                       
                        </label>
                    </div>
                </div>      
    ) 
    }
}