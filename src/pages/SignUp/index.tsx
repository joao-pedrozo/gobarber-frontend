import React, { useCallback, useRef } from 'react';
import {
    FiArrowLeft, FiUser, FiMail, FiLock // eslint-disable-line
} from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';
import Input from '../../components/input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles'; //eslint-disable-line
import { useToast } from '../../hooks/toast';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(
        async (data: SignUpFormData) => {
            formRef.current?.setErrors({});
            try {
                const schema = Yup.object().shape({
                    name: Yup.string().required('O campo nome é obrigatório.'),
                    email: Yup.string()
                        .required('Email obrigatório.')
                        .email('Digite um email válido'),
                    password: Yup.string().min(6, 'No mínimo 6 digitos'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('/users', data);

                history.push('/');

                addToast({
                    type: 'sucess',
                    title: 'Cadastro realizado com sucesso!',
                    description: 'Você já pode fazer seu logon no GoBarber!',
                });
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                    return;
                }
                addToast({
                    type: 'error',
                    title: 'Erro no cadastro',
                    description:
                        'Ocorreu um erro ao fazer o cadastro, tente novamente.',
                });
            }
        },
        [addToast, history],
    );

    return (
        <Container>
            <Background />
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu cadastro</h1>

                        <Input name="name" icon={FiUser} placeholder="Nome" />
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />
                        <Input
                            name="password"
                            icon={FiLock}
                            placeholder="Senha"
                            type="password"
                        />
                        <Button type="submit">Cadastrar</Button>
                    </Form>
                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para Logon
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
};

export default SignUp;
