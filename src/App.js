import React, { useRef, useState, useEffect } from 'react';
import { Form } from '@unform/web';
import { Scope } from '@unform/core';
import * as Yup from 'yup';
import './App.css';

import Input from './components/Form/Input';
//usar initialData={initialData} no form somente para inicializar com dados estaticos
// const initialData = {
//   email: 'mjpancheri@gmail.com',
//   address: {
//     city: 'Batatais',
//   }
// }

function App() {
  //const [user, setUser] = useState({});
  const formRef = useRef(null);
  async function handleSubmit(data, { reset }){
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        email: Yup.string()
          .email('Digite um email válido')
          .required('O email é obrigatório'),
        address: Yup.object().shape({
          city: Yup.string()
            .min(3, 'No mínimo 3 caracteres')
            .required('A cidade é obrigatória')
        })
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      console.log(data);
      formRef.current.setErrors({});
      reset();
    }catch(err){
      if(err instanceof Yup.ValidationError){
        const errorMessages = {};

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        })

        formRef.current.setErrors(errorMessages);
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      formRef.current.setData({
        name: 'Marcio',
        email: 'mjpancheri@gmail.com',
        address:{
          city: 'Batatais'
        }
      })
    }, 2000);
  }, []);

  return (
    <div className="App">
      <h1>Hello!</h1>
      
      <Form ref={formRef}  onSubmit={handleSubmit}>
        <Input name="name" />
        <Input type="email" name="email" />
        <Scope path="address">
          <Input name="street" />
          <Input name="number" />
          <Input name="neighborhood" />
          <Input name="city" />
          <Input name="state" />
        </Scope>
        
        <Input type="password" name="password" />

        <button type="submit">Enviar</button>
      </Form>
    </div>
  );
}

export default App;
