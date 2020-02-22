import './login.page.scss';

import React from 'react';

import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Form } from '../../components/Form/Form';
import { FormField } from '../../components/FormField/FormField';
import { Page } from '../../components/Page/Page';
import Logo from '../../images/logo.svg';
import { Auth } from '../../containers/Auth.container';
import { getGQLError } from '../../lib/apollo';
import * as yup from 'yup';

const loginValidation = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
});


export const LoginPage = () => {
  const { login, loginError, loginLoading } = Auth.useContainer();
  const submit = (e: { email: string, password: string }) => {
    login(e.email, e.password);
  };

  return <Page title="Login" type="login">
    <Card>
      <Logo className="logo" />
      <Form onSubmit={submit} error={getGQLError(loginError)} validationSchema={loginValidation}>
        <FormField label="email" name="email" type="text" placeholder="Email" icon="user" iconColor="grey-40" />
        <FormField label="password" name="password" placeholder="Password" type="password" icon="lock" iconColor="grey-40" />
        <Button disabled={loginLoading}>Login</Button>
      </Form>
    </Card>
  </Page>;
};
