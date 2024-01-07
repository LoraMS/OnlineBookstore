import React from 'react';
import moment from 'moment';
import './Comment.css';

const Comment = (props) => {
    moment.locale('en');
    const imgURL = 'https://drive.google.com/thumbnail?id=11uo_6bgKcjtkZkSJQYj47CTa-_C-hh0P';
    return (
        <div className="row">
            <div className="col-md-1">
                <img src={imgURL} alt="profile_img" />
            </div>
            <div className="col-md-11">
                <div className="info p-3 mb-3 border bg-white">
                    <p>{props.props.content}</p>
                    <div className="text-muted">
                        <small>
                            by {props.props.author} on {moment(props.props.date).format('LL')}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;

