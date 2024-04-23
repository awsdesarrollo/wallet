import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { AuthService } from '../../services';
import { Logo } from '../../assets/images';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

const RecoverPassword = () => {
  const { code } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    code,
    password: '',
    password_confirmation: '',
  });
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onChange = (target, value) => {
    setFormData(s => ({ ...s, [target]: value }))
  }

  const isValidForm = () => {
    const onError = (msg) => {
      toast.error(msg);
      return false;
    }

    if (!formData.code)
      return onError('El código es obligatorio');

    if (!formData.password)
      return onError('La contraseña es obligatoria');

    if (!formData.password_confirmation)
      return onError('Debe confirmar la contraseña');

    if (formData.password !== formData.password_confirmation)
      return onError('Las contraseñas no coinciden');

    return true;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (!isValidForm()) return;
    setIsLoading(true);

    try {
      const res = await AuthService.resetPassword(formData);

      if (res?.error) return toast.error(res.error);
      if (!res?.result) return toast.error('Código inválido');

      toast.success('Contraseña actualizada con éxito');
      setTimeout(() => window.location.replace('../login'), 3000);

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const visibilityBtn = (
    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
      {isVisible ? (
        <IconEyeOff className="w-6 h-6" />
      ) : (
        <IconEye className="w-6 h-6" />
      )}
    </button>
  )

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="relative w-96 p-8">
        <form onSubmit={submit} className="flex flex-col justify-center gap-6">
          <div className="flex justify-center">
            <img src={Logo} alt="Icono" className="w-40" />
          </div>

          <Input
            placeholder="Nueva contraseña"
            classNames={{
              base: 'w-full',
              inputWrapper: 'border-1 h-10',
              label: 'text-md font-bold',
            }}
            type={isVisible ? "text" : "password"}
            value={formData.password}
            onValueChange={v => onChange('password', v)}
            endContent={visibilityBtn}
          />

          <Input
            placeholder="Repetir contraseña"
            classNames={{
              base: 'w-full',
              inputWrapper: 'border-1 h-10',
              label: 'text-md font-bold',
            }}
            type={isVisible ? "text" : "password"}
            value={formData.password_confirmation}
            onValueChange={v => onChange('password_confirmation', v)}
            endContent={visibilityBtn}
          />

          <div className="submit">
            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              <span>Guardar</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecoverPassword;