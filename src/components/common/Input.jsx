import React from 'react';

const Input = (props) => {
        const { name, type, value, onChange, label, placeholder } = props;
        return(
            <div>
                <label className="sr-only" htmlFor={name}>{label}</label>
                <input className="form-control" required
                id={name}
                type={type} 
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}/>
            </div>
        );
}

export default Input;