/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconEyeOff, IconPlus } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import { Constants, Socket, SocketEvents, formatAmount, fromPhotos, getOnlyNumbers } from '../../utils';
import { UsersService } from '../../services';

const MODAL_ACTION = {
  NONE: 0,
  BALANCE: 1,
  PERFORMANCE: 4,
}

const EditUser = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [modalAction, setModalAction] = useState(MODAL_ACTION.NONE);
  const { addBalance, addPerformance, data, goToPage, isLoading, onChange, pagination, updateItem, user } = useFetchTable();

  const closeModal = () => {
    setModalAction(MODAL_ACTION.NONE);
  }

  const visibilityBtn = (
    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
      {isVisible ? (
        <IconEyeOff className="w-6 h-6" />
      ) : (
        <IconEye className="w-6 h-6" />
      )}
    </button>
  );

  useEffect(() => {
    const slot = document.getElementById('desk-headerbar-left-slot');
    slot.classList.remove('hidden');
    slot.innerHTML = ReactDOMServer.renderToString(
      <div className="flex gap-4 items-center">
        <IconArrowLeft id="go-back-btn" className="cursor-pointer" />
        <span className="font-medium text-lg">Usuarios</span>
      </div>
    );
    const goBackBtn = document.getElementById('go-back-btn');
    goBackBtn.addEventListener('click', () => navigate(-1));
    return () => {
      goBackBtn.removeEventListener('click', () => {});
      slot.classList.add('hidden');
      slot.innerHTML = '';
    }
  });

  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen fixed inset-0 z-[70] flex justify-center items-center bg-white/30">
          <Spinner />
        </div>
      )}

      <Modal
        size="md"
        isOpen={modalAction !== MODAL_ACTION.NONE}
        onClose={closeModal}
        backdrop="blur"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => {
            if (modalAction === MODAL_ACTION.BALANCE) return (
              <ModalAddbalance
                user={user}
                onClose={onClose}
                onSubmit={form => {
                  addBalance(form);
                  onClose();
                }}
              />
            );
            if (modalAction === MODAL_ACTION.PERFORMANCE) return (
              <ModalAddPerformance
                onClose={onClose}
                onSubmit={form => {
                  addPerformance(form);
                  onClose();
                }}
              />
            );
          }}
        </ModalContent>
      </Modal>

      <section className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-[5fr_3fr] gap-4 mb-4">
        <div className="flex justify-between items-center col-span-2">
          <span className="text-2xl font-semibold">Editar Usuario</span>
          <Button color="primary" onClick={() => updateItem(user)}>Guardar</Button>
        </div>
        <div className="bg-background grid grid-cols-2 gap-4 p-4 rounded-medium">
          <Input
            classNames={{ inputWrapper: 'border-1 h-10', label: 'text-md font-bold' }}
            label="Nombre"
            labelPlacement="outside"
            placeholder=" "
            variant="bordered"
            value={user?.name ?? ''}
            onValueChange={v => onChange(v, 'name')}
          />
          <div />
          <Input
            label="Contraseña"
            labelPlacement="outside"
            placeholder=" "
            variant="bordered"
            classNames={{ inputWrapper: 'border-1 h-10', label: 'text-md font-bold' }}
            type={isVisible ? "text" : "password"}
            value={user?.password}
            onValueChange={v => onChange(v, 'password')}
            endContent={visibilityBtn}
          />
          <Input
            label="Confirmar contraseña"
            labelPlacement="outside"
            placeholder=" "
            variant="bordered"
            classNames={{ inputWrapper: 'border-1 h-10', label: 'text-md font-bold' }}
            type={isVisible ? "text" : "password"}
            value={user?.confirmPassword}
            onValueChange={v => onChange(v, 'confirmPassword')}
            endContent={visibilityBtn}
          />
        </div>
        <div className="bg-background py-4 rounded-medium grid grid-cols-[5fr_3fr]">
          <div className="pl-4 pb-2 text-2xl font-bold leading-10">Saldo global</div>
          <div className="pl-4 pb-2 text-2xl lg:text-4xl font-bold text-nowrap">
            { formatAmount(user?.balance + user?.performance, '$') }
          </div>
          <div className="pl-4 py-2 border-t-1 leading-8">Saldo inicial</div>
          <div className="px-4 py-2 border-t-1 text-2xl font-bold flex justify-between items-center">
            <span className="text-nowrap">{ formatAmount(user?.balance, '$') }</span>
            <div>
              <IconPlus
                className="bg-green text-background cursor-pointer"
                onClick={() => setModalAction(MODAL_ACTION.BALANCE)}
                size={20}
              />
            </div>
          </div>
          <div className="pl-4 py-2 border-t-1 leading-8 border-b-1">Rendimiento</div>
          <div className="px-4 py-2 border-t-1 text-2xl font-bold border-b-1 flex justify-between items-center">
            <span className="text-nowrap">{ formatAmount(user?.performance, '$') }</span>
            <div>
              <IconPlus
                className="bg-green text-background cursor-pointer"
                onClick={() => setModalAction(MODAL_ACTION.PERFORMANCE)}
                size={20}
              />
            </div>
          </div>
          <Input
            label="Fecha de creación"
            labelPlacement="outside"
            placeholder=" "
            variant="bordered"
            classNames={{ base: 'px-4 pt-4', inputWrapper: 'border-1 h-10', label: 'text-md font-bold' }}
            readOnly
            value={user?.created_at ? moment(user?.created_at).format('DD/MM/YYYY') : ''}
            onValueChange={() => {}}
          />
          <Input
            label="Estado"
            labelPlacement="outside"
            placeholder=" "
            variant="bordered"
            readOnly
            classNames={{ base: 'px-4 pt-4', inputWrapper: 'border-1 h-10', label: 'text-base font-bold' }}
            value={user?.status_text || ''}
            onValueChange={() => {}}
          />
        </div>
      </section>

      <Table
        aria-label="Usuarios"
        color="primary"
        topContentPlacement="inside"
        topContent={
          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-medium">Ordenes</h3>
          </div>
        }
      >
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Origen de fondo</TableColumn>
          <TableColumn>Fecha de registro</TableColumn>
          <TableColumn>Monto</TableColumn>
        </TableHeader>
        <TableBody items={data} emptyContent="No hay resultados">
          {(item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <User
                    avatarProps={{ showFallback: true, radius: 'full', src: user?.photo ? fromPhotos(user.photo) : null }}
                    name={user?.fullName}
                    classNames={{ description: 'text-foreground-500' }}
                  />
                </TableCell>
                <TableCell>{ item.type }</TableCell>
                <TableCell>{ !!item.date ? moment(item.date).format('DD/MM/YYYY') : '-' }</TableCell>
                <TableCell>{ formatAmount(item.amount, '$') }</TableCell>
              </TableRow>
            )
          }}
        </TableBody>
      </Table>

      <div className="flex w-full justify-center mt-4">
        <Pagination
          showControls
          variant="bordered"
          page={pagination.page}
          total={pagination.pages}
          onChange={goToPage}
        />
      </div>
    </>
  );
}

const ModalAddbalance = ({ user, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    amount: (user?.balance || 0) * 100,
    amount_formatted: formatAmount((user?.balance || 0)),
    date: user?.balance_date ?? '',
  });

  const onChange = (value, target) => {
    setForm(s => ({
      ...s,
      [target]: value,
      amount_formatted: target === 'amount'
        ? formatAmount(value / 100)
        : s.amount_formatted,
    }));
  }

  const submit = () => {
    onSubmit({ ...form, amount: (form.amount / 100).toFixed(2) });
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Saldo inicial</ModalHeader>
      <ModalBody>
        <div className="flex justify-between gap-4">
          <Input
            label="Saldo inicial"
            labelPlacement="outside"
            isClearable
            onClear={() => onChange('', 'amount')}
            startContent={(
              <span
                className="absolute w-36 text-sm text-right overflow-hidden"
                onClick={e => e.target.nextElementSibling.focus()}
              >
                { form.amount_formatted }
              </span>
            )}
            classNames={{
              base: 'w-full',
              inputWrapper: 'border-1 h-10',
              label: 'text-md font-bold',
              input: 'caret-transparent !text-transparent',
            }}
            value={form.amount}
            onValueChange={v => onChange(getOnlyNumbers(v), 'amount')}
          />
          <Input
            label="Fecha"
            labelPlacement="outside"
            type="date"
            classNames={{
              base: 'w-full',
              inputWrapper: 'border-1 h-10',
              label: 'text-md font-bold',
              input: `pr-0 text-${!!form.date ? '[]':'foreground-400'}`,
            }}
            value={form.date}
            onValueChange={v => onChange(v, 'date')}
          />
        </div>
      </ModalBody>
      <ModalFooter className="justify-evenly">
        <Button variant="light" onPress={onClose}>Cancelar</Button>
        <Button color="primary" onPress={submit}>Guardar</Button>
      </ModalFooter>
    </>
  )
}

const ModalAddPerformance = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    amount: '',
    amount_formatted: '0,00',
    date: '',
  });

  const onChange = (value, target) => {
    setForm(s => ({
      ...s,
      [target]: value,
      amount_formatted: target === 'amount'
        ? formatAmount(value / 100)
        : s.amount_formatted,
    }));
  }

  const submit = () => {
    onSubmit({ ...form, amount: (form.amount / 100).toFixed(2) });
  }

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Rendimiento</ModalHeader>
      <ModalBody>
        <div className="flex justify-between gap-4">
          <Input
            label="Monto"
            labelPlacement="outside"
            isClearable
            onClear={() => onChange('', 'amount')}
            startContent={(
              <span
                className="absolute w-36 text-sm text-right overflow-hidden"
                onClick={e => e.target.nextElementSibling.focus()}
              >
                { form.amount_formatted }
              </span>
            )}
            classNames={{
              base: 'w-full',
              inputWrapper: 'border-1 h-10',
              label: 'text-md font-bold',
              input: 'caret-transparent !text-transparent',
            }}
            value={form.amount}
            onValueChange={v => onChange(getOnlyNumbers(v), 'amount')}
          />
          <Input
            label="Fecha"
            labelPlacement="outside"
            type="date"
            classNames={{
              base: 'w-full',
              inputWrapper: 'border-1 h-10',
              label: 'text-md font-bold',
              input: `pr-0 text-${!!form.date ? '[]':'foreground-400'}`,
            }}
            value={form.date}
            onValueChange={v => onChange(v, 'date')}
          />
        </div>
      </ModalBody>
      <ModalFooter className="justify-evenly">
        <Button variant="light" onPress={onClose}>Cancelar</Button>
        <Button color="primary" onPress={submit}>Guardar</Button>
      </ModalFooter>
    </>
  )
}

const useFetchTable = () => {
  const params = useParams();

  const initialFilters = {
    user_id: params?.id,
    page: 1,
    perPage: Constants.PER_PAGE,
    search: '',
    since: null,
    until: null,
  };

  const initialPagination = {
    page: 1,
    pages: 1,
    total: 0,
    perPage: Constants.PER_PAGE,
  };

  const [item, setItem] = useState();
  const [data, setData] = useState([]);
  const [canFetch, setCanFetch] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(initialPagination);

  const debounceTime = 500;
  const debounce = useRef();

  const onChange = (value, target) => {
    setItem(s => ({ ...s, [target]: value }));
  }

  const fetchItem = async () => {
    try {
      const response = await UsersService.admin.findOne(params?.id);
      setItem(response);
      if (!data.length) fetchData();

    } catch (error) {
      setItem(undefined);
      onError(String(error));
    }
  }

  const fetchData = async () => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      const response = await UsersService.admin.findAllMovements(params?.id, filters);
      const { data, ...rest } = response;

      setData(data);
      setPagination(rest);
      setCanFetch(true);

    } catch (error) {
      setData([]);
      onError(String(error));
    }
  }

  const addBalance = async (form) => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      await UsersService.admin.addBalance({ user_id: item.id, ...form });
      fetchItem();
      fetchData();
      emitUpdate();
      toast.success('Saldo actualizado con éxito');

    } catch (error) {
      onError(String(error));
    }
    setCanFetch(true);
  }

  const addPerformance = async (form) => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      await UsersService.admin.addPerformance({ user_id: item.id, ...form });
      fetchItem();
      fetchData();
      emitUpdate();
      toast.success('Rendimiento agregado con éxito');

    } catch (error) {
      onError(String(error));
    }
    setCanFetch(true);
  }

  const updateItem = async (form) => {
    if (!canFetch) return;

    if ((!!form.password || !!form.confirmPassword) && form.password !== form.confirmPassword)
      return toast.error('Las contraseñas no coinciden');

    setCanFetch(false);

    try {
      const response = await UsersService.admin.update({ ...item, ...form });
      setItem({ ...response, password: '', confirmPassword: '' });
      emitUpdate();
      toast.success('Usuario actualizado con éxito');

    } catch (error) {
      onError(String(error));
    }
    setCanFetch(true);
  }

  const emitUpdate = () => {
    Socket.emit(SocketEvents.USER.UPDATED_USER, { user_id: item.id });
  }

  const getCurrentPagination = () => {
    // Truco para obtener el estado actualizado (pagination es mantenida con el estado actual por el componente Pagination)
    let pag;
    setPagination(s => {
      pag = s;
      return s;
    });
    return pag;
  }

  const canResetFilter = () => {
    const { page, perPage, ...initial } = initialFilters;
    const { page: _, perPage: __, ...current } = filters;
    const initFilter = JSON.stringify(initial);
    const currFilter = JSON.stringify(current);
    return initFilter !== currFilter;
  }

  const onError = (msg) => toast.error(msg);

  const reload = (inSamePage = false) => {
    setCanFetch(true);
    if (!inSamePage) setFilters(initialFilters);
    else fetchData();
  }

  const goToPage = (page) => {
    const pagination = getCurrentPagination();
    if (page >= 1 && page <= pagination.pages && page !== pagination.page) {
      setCanFetch(true);
      setFilters({ ...filters, page });
    }
  }

  const changePerPage = (perPage) => {
    setCanFetch(true);
    setFilters({ ...filters, perPage });
  }

  const filterBy = (value, target) => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setCanFetch(true);
      setFilters({ ...filters, page: 1, [target]: value });
    }, debounceTime);
  }

  useEffect(() => {
    if (!!item?.id) fetchData();
  }, [filters]);

  useEffect(() => {
    fetchItem();
  }, []);

  return {
    addBalance,
    addPerformance,
    canResetFilter: canResetFilter(),
    changePerPage,
    data,
    filterBy,
    filters,
    goToPage,
    isLoading: !canFetch,
    onChange,
    pagination,
    reload,
    updateItem,
    user: item,
  }
}

export default EditUser;
