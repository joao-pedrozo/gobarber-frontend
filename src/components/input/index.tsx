import React, { InputHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react'; // eslint-disable-line
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

import Tooltip from '../Tooltip';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    icon: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
    const { fieldName, defaultValue, error, registerField } = useField(name); // eslint-disable-line
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setFocused] = useState(false);

    const [isFilled, setIsFilled] = useState(false);

    const handleInputBlur = useCallback(() => {
        setFocused(false);
        setIsFilled(!!inputRef.current?.value);
    }, []);

    const handleInputFocus = useCallback(() => {
        setFocused(true);
    }, []);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            path: 'value',
        });
    }, [fieldName, registerField]);

    return (
        <Container
            isFocused={isFocused}
            isErrored={!!error}
            isFilled={isFilled}
        >
            {Icon && <Icon size={20} />}
            <input
                ref={inputRef}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                {...rest}
            />
            {error && (
                <Error title={error}>
                    <FiAlertCircle color="#c53030" size={20} />
                </Error>
            )}
        </Container>
    );
};

export default Input;
