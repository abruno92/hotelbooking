import React, { Component } from 'react'
import defaultPic from '../../images/advatar.png'
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
                    <div class="overlay">
                        <label class="custom-file-upload">
                            <div className="icon">
                                <input type="file" name="image-upload" id="input" accept="image/*" onChange={this.imageHandler}/>
                                <i class="fas fa-camera"></i>
                            </div>                       
                        </label>
                    </div>

                    
                </div>      
    ) 
    }
}