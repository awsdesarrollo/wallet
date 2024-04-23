/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from '@nextui-org/react';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import { Constants, formatAmount, fromPhotos } from '../../utils';
import { UsersService } from '../../services';
import ModalCreate from './create-user';
import { Link } from 'react-router-dom';

const MODAL_ACTION = {
  NONE: 0,
  CREATE: 1,
  VIEW: 2,
  EDIT: 3,
  DELETE: 4,
}

const Users = () => {
  const [selectedItem, setSelectedItem] = useState();
  const [modalAction, setModalAction] = useState(MODAL_ACTION.NONE);
  const { canResetFilter, data, filterBy, goToPage, isLoading, pagination, reload, deleteItem } = useFetchTable();

  const onSelectItem = (item, action) => {
    setSelectedItem(item);
    setModalAction(action);
  }

  const closeModal = (reloading = false) => {
    setSelectedItem(null);
    setModalAction(MODAL_ACTION.NONE);
    if (reloading) reload();
  }

  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen fixed inset-0 z-[70] flex justify-center items-center bg-white/30">
          <Spinner />
        </div>
      )}

      <Modal
        size="4xl"
        isOpen={modalAction !== MODAL_ACTION.NONE}
        onClose={() => closeModal()}
        backdrop="blur"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => {
            if (modalAction === MODAL_ACTION.CREATE) return (
              <ModalCreate onClose={onClose} onSuccess={() => closeModal(true)} />
            );
            if (modalAction === MODAL_ACTION.DELETE) return (
              <ModalDelete
                user={selectedItem}
                onClose={onClose}
                onDelete={()=> {
                  deleteItem(selectedItem?.id);
                  closeModal(true);
                }}
              />
            );
          }}
        </ModalContent>
      </Modal>

      <Filters
        canResetFilter={canResetFilter}
        filterBy={filterBy}
        resetFilter={() => reload()}
      />

      <Table
        aria-label="Usuarios"
        color="primary"
        topContentPlacement="inside"
        topContent={
          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-medium">Usuarios</h3>
            <Button
              color="primary"
              className="pl-2"
              startContent={<IconPlus color="white" />}
              onClick={() => onSelectItem(null, MODAL_ACTION.CREATE)}
            >
              Agregar
            </Button>
          </div>
        }
      >
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Fecha de registro</TableColumn>
          <TableColumn>Teléfono</TableColumn>
          <TableColumn>Monto</TableColumn>
          <TableColumn align="end" />
        </TableHeader>
        <TableBody items={data} emptyContent="No hay resultados">
          {(user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <User
                    avatarProps={{ showFallback: true, radius: 'full', src: user?.photo ? fromPhotos(user.photo) : null }}
                    description={user.email}
                    name={user?.fullName}
                    classNames={{ description: 'text-foreground-500' }}
                  />
                </TableCell>
                <TableCell>{ user.status_text }</TableCell>
                <TableCell>{ moment(user.created_at).format('DD/MM/YYYY') }</TableCell>
                <TableCell>{ user.phone }</TableCell>
                <TableCell>{ formatAmount(user.balance + user.performance, '$') }</TableCell>
                <TableCell align="right">
                  <div className="relative flex justify-end items-center gap-2">
                    <Tooltip content="Editar">
                      <Link to={`/usuarios/${user.id}/editar`}>
                        <IconEdit onClick={() => onSelectItem(user, MODAL_ACTION.EDIT)} />
                      </Link>
                    </Tooltip>
                    <Tooltip content="Eliminar" color="danger">
                      <IconTrash className="text-danger" onClick={() => onSelectItem(user, MODAL_ACTION.DELETE)} />
                    </Tooltip>
                  </div>
                </TableCell>
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

const Filters = ({ canResetFilter, filterBy, resetFilter }) => {
  const initialFilter = {
    search: '',
    since: '',
    until: '',
  };
  const [form, setForm] = useState(initialFilter);

  const onChange = (value, target) => {
    setForm(s => ({ ...s, [target]: value }));
    filterBy(value, target);
  }

  return (
    <section className="mb-4 grid sm:flex grid-cols-2 lg:flex-row items-end gap-4">
      <Input
        classNames={{
          base: 'w-full sm:max-w-[15rem]',
          inputWrapper: 'border-1 h-10',
        }}
        label="Buscar"
        labelPlacement="outside"
        placeholder="Nombre"
        startContent={<IconSearch />}
        variant="bordered"
        value={form.search}
        onValueChange={v => onChange(v, 'search')}
      />
      <Input
        type="date"
        classNames={{
          base: 'w-full sm:max-w-[10rem]',
          inputWrapper: 'border-1 h-10',
          input: `pr-0 text-${!!form.since ? '[]':'foreground-400'}`,
        }}
        label="Desde"
        labelPlacement="outside"
        placeholder=" "
        variant="bordered"
        value={form.since}
        onValueChange={v => onChange(v, 'since')}
      />
      <Input
        type="date"
        classNames={{
          base: 'w-full md:max-w-[10rem]',
          inputWrapper: 'border-1 h-10',
          input: `pr-0 text-${!!form.until ? '[]':'foreground-400'}`,
        }}
        label="Hasta"
        labelPlacement="outside"
        placeholder=" "
        variant="bordered"
        value={form.until}
        onValueChange={v => onChange(v, 'until')}
      />
      {canResetFilter && (
        <Button
          variant="light"
          className="text-primaryDark"
          onClick={() => {
            setForm(initialFilter);
            resetFilter();
          }}
        >
          Limpiar filtros
        </Button>
      )}
    </section>
  )
}

const ModalDelete = ({ user, onClose, onDelete }) => {
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Confirmación</ModalHeader>
      <ModalBody>
        <p className="text-center">¿Estás seguro de eliminar este usuario?</p>
        <p className="text-center font-medium">{ user.fullName }</p>
      </ModalBody>
      <ModalFooter className="justify-evenly">
        <Button variant="light" onPress={onClose}>Cancelar</Button>
        <Button color="danger" onPress={onDelete}>Aceptar</Button>
      </ModalFooter>
    </>
  )
}

const useFetchTable = () => {
  const initialFilters = {
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

  const [data, setData] = useState([]);
  const [canFetch, setCanFetch] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(initialPagination);

  const debounceTime = 500;
  const debounce = useRef();

  const fetchData = async () => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      const response = await UsersService.admin.findAll(filters);
      const { data, ...rest } = response;

      setData(data);
      setPagination(rest);
      setCanFetch(true);

    } catch (error) {
      setData([]);
      onError(String(error));
    }
  }

  const deleteItem = async (id) => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      await UsersService.admin.destroy(id);
      toast.success('Usuario eliminado con éxito');
      fetchData();

    } catch (error) {
      onError(String(error));
    }
    setCanFetch(true);
  }

  const updateItem = async (user) => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      await UsersService.admin.update(user);
      toast.success('Usuario actualizado con éxito');
      fetchData();

    } catch (error) {
      onError(String(error));
    }
    setCanFetch(true);
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
    fetchData();
  }, [filters]);

  return {
    canResetFilter: canResetFilter(),
    changePerPage,
    data,
    deleteItem,
    filters,
    filterBy,
    goToPage,
    isLoading: !canFetch,
    pagination,
    reload,
    updateItem,
  }
}

export default Users;
