/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Input, ModalHeader, ModalBody, ModalFooter, Button, Avatar } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { UsersService } from '../../services';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { formatAmount, getOnlyNumbers } from '../../utils';

const ModalCreate = ({ onSuccess, onClose }) => {
  const { form, onChange, onSubmit } = useForm();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const submit = async () => {
    const isSuccess = await onSubmit();
    if (isSuccess) onSuccess();
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
    <>
      <ModalHeader className="flex flex-col gap-1">Agregar Usuario</ModalHeader>
      <ModalBody className="flex-row-reverse gap-8">
        <div className="relative">
          <label htmlFor="photo" className="flex justify-center">
            <Avatar src={form.photoUrl} className="w-20 h-20" />
            <input
              id="photo"
              type="file"
              accept="image/*"
              hidden
              onChange={e => onChange(e.target.files[0], 'photo')}
            />
          </label>
          <Button as="label" htmlFor="photo" className="mt-4" color="primary" size="sm">
            Añadir imagen
          </Button>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <div className="flex gap-4">
            <Input
              classNames={{ inputWrapper: 'border-1 h-12' }}
              label="Nombre"
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              value={form.name}
              onValueChange={v => onChange(v, 'name')}
            />
            <Input
              classNames={{ inputWrapper: 'border-1 h-12' }}
              label="Teléfono"
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              type="tel"
              value={form.phone}
              onValueChange={v => onChange(v, 'phone')}
            />
            <Input
              classNames={{ inputWrapper: 'border-1 h-12' }}
              label="Correo electrónico"
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              value={form.email}
              onValueChange={v => onChange(v, 'email')}
            />
          </div>

          <div className="flex gap-4">
            <Input
              label="Contraseña"
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              type={isVisible ? "text" : "password"}
              value={form.password}
              classNames={{ inputWrapper: 'border-1 h-12' }}
              onValueChange={v => onChange(v, 'password')}
              endContent={visibilityBtn}
            />
            <Input
              label="Confirmar contraseña"
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              type={isVisible ? "text" : "password"}
              value={form.confirmPassword}
              classNames={{ inputWrapper: 'border-1 h-12' }}
              onValueChange={v => onChange(v, 'confirmPassword')}
              endContent={visibilityBtn}
              />
          </div>

          <Input
            classNames={{
              inputWrapper: 'border-1 h-12 max-w-48',
              input: 'caret-transparent !text-transparent',
            }}
            label="Saldo inicial"
            labelPlacement="outside"
            placeholder=" "
            isClearable
            onClear={() => onChange('', 'balance')}
            startContent={(
              <span
                className="absolute w-36 text-sm overflow-hidden text-right"
                onClick={e => e.target.nextElementSibling.focus()}
              >
                { form.balance_formatted }
              </span>
            )}
            variant="bordered"
            value={form.balance}
            onValueChange={v => onChange(getOnlyNumbers(v), 'balance')}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onPress={onClose}>Cerrar</Button>
        <Button color="primary" onPress={submit}>Guardar</Button>
      </ModalFooter>
    </>
  )
}

const useForm = () => {
  const initialForm = {
    photo: '',
    photoUrl: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    balance: '',
    balance_formatted: '0,00',
    hasFile: true,
  };

  const [form, setForm] = useState(initialForm);

  const onChange = (value, target) => {
    if (target === 'photo' && !!value) {
      setForm(s => {
        return { ...s, photoUrl: URL.createObjectURL(value) }
      });
    }

    setForm(s => ({
      ...s,
      [target]: value,
      balance_formatted: target === 'balance'
        ? formatAmount(value / 100)
        : s.balance_formatted,
    }));
  }

  const onError = (msg) => {
    toast.error(msg);
    return false;
  }

  const isValidForm = () => {
    if (!form.name)
      return onError('El nombre es obligatorio');

    if (!form.phone)
      return onError('El teléfono es obligatorio');

    if (!form.email)
      return onError('El correo es obligatorio');

    if (!form.password)
      return onError('La contraseña es obligatoria');

    if (form.password !== form.confirmPassword)
      return onError('Las contraseñas no coinciden');

    if (form.balance === '')
      return onError('El saldo inicial es obligatorio');

    return true;
  }

  const onSubmit = async () => {
    if (!isValidForm()) return;
    try {
      await UsersService.admin.create({
        ...form,
        balance: (form.balance / 100).toFixed(2),
      });
      toast.success('Usuario creado correctamente');
      return true;

    } catch (error) {
      onError(String(error));
      return false;
    }
  }

  return { form, onChange, onSubmit }
}

export default ModalCreate;
