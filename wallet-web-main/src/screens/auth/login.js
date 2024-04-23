import React, { useContext, useState } from 'react';
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthService } from '../../services';
import { LoginBG, Logo } from '../../assets/images';
import { AuthContext } from '../../context/auth.context';

const Login = () => {

  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { form, isLoading, onChange, onSubmit, onRecover } = useForm();

  return (
    <div id="login" className="h-screen grid md:grid-cols-2">

      <Modal
        size="sm"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        backdrop="blur"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <ModalForgotPassword
              onClose={onClose}
              onSubmit={async (email) => {
                const success = await onRecover(email);
                if (success) onClose();
              }}
            />
          )}
        </ModalContent>
      </Modal>

      <div className="login-bg hidden md:flex justify-center items-center">
        <img className="mx-auto h-80 w-auto absolute text-center" src={Logo} alt={process.env.REACT_APP_NAME} />
        <img src={LoginBG} className="object-cover h-full" alt="" />
      </div>
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm border-b pb-4">
          <img className="mx-auto h-32 w-auto" src={Logo} alt={process.env.REACT_APP_NAME} />
          <h2 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-white">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={() => onSubmit()}>
            <div className="font-medium leading-6 flex flex-col gap-4">
              <Input
                label="E-Mail Address"
                labelPlacement="outside"
                placeholder="E-Mail Address"
                type="email"
                variant="bordered"
                classNames={{ label: 'text-md' }}
                value={form.email}
                onValueChange={v => onChange(v, 'email')}
              />

              <Input
                label="Contraseña"
                labelPlacement="outside"
                placeholder="Contraseña"
                variant="bordered"
                type={isVisible ? "text" : "password"}
                value={form.password}
                classNames={{ label: 'text-md' }}
                onValueChange={v => onChange(v, 'password')}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <IconEyeOff className="w-6 h-6" />
                    ) : (
                      <IconEye className="w-6 h-6" />
                    )}
                  </button>
                }
              />

              <Checkbox
                isSelected={form.remember}
                onClick={() => onChange(!form.remember, 'remember')}
              >
                Recuérdame
              </Checkbox>
            </div>

            <div className="text-center flex flex-col items-center">
              <Button className="w-1/3" type="submit" color="primary" isLoading={isLoading} onClick={onSubmit}>
                <span className="font-semibold">Ingresar</span>
              </Button>

              <span className="font-semibold my-4 hover:underline cursor-pointer" onClick={() => setShowModal(true)}>
                Cambio de contraseña
              </span>

              <p className="text-xs">
                &copy; { new Date().getFullYear() }. Todos los derechos reservados. Diseñado por Jesús Vicuña
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const ModalForgotPassword = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');

  const submit = () => {
    if (!email) return toast.error('Debe indicar el correo');
    onSubmit(email);
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Recuperación de contraseña</ModalHeader>
      <ModalBody>
        <p>Se le enviará un enlace a su correo electrónico para el cambio de contraseña</p>
        <div className="mt-4">
          <Input
            label="Correo"
            labelPlacement="outside"
            placeholder=" "
            classNames={{
              base: 'w-full',
              inputWrapper: 'border-1 h-10',
              label: 'text-md font-bold',
            }}
            value={email}
            onValueChange={setEmail}
          />
        </div>
      </ModalBody>
      <ModalFooter className="justify-evenly">
        <Button variant="light" onPress={onClose}>Cancelar</Button>
        <Button color="primary" onPress={submit}>Enviar</Button>
      </ModalFooter>
    </>
  )
}

const useForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (value, target) => {
    setForm(s => ({ ...s, [target]: value }));
  }

  const isValidForm = () => {
    const onError = (msg) => {
      toast.error(msg);
      return false;
    }

    if (!form.email)
      return onError('Debe ingresar el correo');

    if (!form.password)
      return onError('Debe ingresar la contraseña');

    return true;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (!isValidForm()) return;
    setIsLoading(true);

    try {
      const session = await AuthService.login(form);
      login(session.user?.user);
      navigate('/');

    } catch (error) {
      toast.error(error || 'Ocurrió un error inesperado')
    }
    setIsLoading(false);
  }

  const recover = async (email) => {
    setIsLoading(true);

    try {
      await AuthService.recover({ email });
      toast.success('Se le ha enviado el link de recuperación a su correo');
      setIsLoading(false);
      return true;

    } catch (error) {
      toast.error(error || 'Ocurrió un error inesperado');
      setIsLoading(false);
      return false;
    }
  }

  return {
    form,
    isLoading,
    isValidForm,
    onChange,
    onRecover: recover,
    onSubmit: submit,
  };
}

export default Login;