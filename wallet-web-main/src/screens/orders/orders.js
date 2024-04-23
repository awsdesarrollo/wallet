/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from '@nextui-org/react';
import { IconDotsVertical, IconSearch } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import { Constants, Socket, SocketEvents, formatAmount, fromPhotos } from '../../utils';
import { GeneralService, OrdersService } from '../../services';

const MODAL_ACTION = {
  NONE: 0,
  APPROVE: 1,
  REJECT: 2,
}

const serviceStatuses = [
  { value: Constants.ORDER.STATUS.PENDING, label: 'Pendiente' },
  { value: Constants.ORDER.STATUS.APPROVED, label: 'Aprobado' },
  { value: Constants.ORDER.STATUS.REJECTED, label: 'Rechazado' },
];

function getStatusColor(status) {
  switch (status) {
    case Constants.ORDER.STATUS.PENDING:
      return 'warning';
    case Constants.ORDER.STATUS.APPROVED:
      return 'success';
    case Constants.ORDER.STATUS.REJECTED:
      return 'danger';
    default:
      return 'default';
  }
}

const Services = () => {
  const [selectedItem, setSelectedItem] = useState();
  const [modalAction, setModalAction] = useState(MODAL_ACTION.NONE);
  const { approveItem, canResetFilter, data, filterBy, fundsSources, goToPage, isLoading, pagination, paymentMethods, rejectItem, reload } = useFetchTable();

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
        size="2xl"
        isOpen={!!selectedItem}
        onClose={() => closeModal()}
        backdrop="blur"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => {
            if (modalAction === MODAL_ACTION.APPROVE) return (
              <ModalApprove
                item={selectedItem}
                onClose={onClose}
                onApprove={()=> {
                  approveItem(selectedItem);
                  closeModal(true);
                }}
              />
            );
            if (modalAction === MODAL_ACTION.REJECT) return (
              <ModalReject
                item={selectedItem}
                onClose={onClose}
                onReject={()=> {
                  rejectItem(selectedItem);
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
        paymentMethods={paymentMethods}
        fundsSources={fundsSources}
      />

      <Table
        aria-label="Transacciones"
        color="primary"
        topContentPlacement="inside"
        topContent={
          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-medium">Transacciones</h3>
          </div>
        }
      >
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Origen de fondo</TableColumn>
          <TableColumn>Método de pago</TableColumn>
          <TableColumn>Fecha de registro</TableColumn>
          <TableColumn>Monto</TableColumn>
          <TableColumn>Comisión</TableColumn>
          <TableColumn>Estatus</TableColumn>
          <TableColumn align="end" />
        </TableHeader>
        <TableBody items={data} emptyContent="No hay resultados">
          {(item) => {
            const statusColor = getStatusColor(item.status);
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <User
                    avatarProps={{ showFallback: true, radius: 'full', src: item?.user?.photo ? fromPhotos(item?.user.photo) : null }}
                    name={item?.user?.name}
                    classNames={{ description: 'text-foreground-500' }}
                  />
                </TableCell>
                <TableCell>{ item?.funds_source?.name }</TableCell>
                <TableCell>{ item?.payment_method?.name }</TableCell>
                <TableCell>{ moment(item.created_at).format('DD/MM/YYYY') }</TableCell>
                <TableCell>{ formatAmount(item.amount, '$') }</TableCell>
                <TableCell>{ !!item.amount_commission && formatAmount(item.amount_commission, '$') }</TableCell>
                <TableCell>
                  <Chip variant="dot" color={statusColor}>{ item?.status_text }</Chip>
                </TableCell>
                <TableCell align="right">
                  {item.status === Constants.ORDER.STATUS.PENDING && (
                    <div className="relative flex justify-end items-center gap-2">
                      <Dropdown>
                        <DropdownTrigger disabled={false}>
                          <Button isIconOnly variant="flat">
                            <IconDotsVertical />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Acciones">
                          <DropdownItem onClick={() => onSelectItem(item, MODAL_ACTION.APPROVE)}>Aprobar</DropdownItem>
                          <DropdownItem onClick={() => onSelectItem(item, MODAL_ACTION.REJECT)}>Rechazar</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  )}
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

const Filters = ({ canResetFilter, filterBy, fundsSources, paymentMethods, resetFilter }) => {
  const initialFilter = {
    search: '',
    status: '',
    payment_method_id: '',
    funds_source_id: '',
    since: '',
    amount: '',
  };
  const [form, setForm] = useState(initialFilter);

  const onChange = (value, target) => {
    setForm(s => ({ ...s, [target]: value }));
    filterBy(value, target);
  }

  return (
    <section className="mb-4 flex flex-col lg:flex-row items-end gap-4">
      <Input
        classNames={{
          base: 'w-full sm:max-w-[15rem]',
          inputWrapper: 'border-1 h-10',
        }}
        label="Buscar"
        labelPlacement="outside"
        placeholder="Nombre usuario"
        startContent={<IconSearch />}
        variant="bordered"
        value={form.search}
        onValueChange={v => onChange(v, 'search')}
      />
      <Select
        label="Estatus"
        labelPlacement="outside"
        placeholder="Seleccionar"
        variant="bordered"
        classNames={{ base: 'w-full sm:max-w-[10rem]', trigger: 'border-1' }}
        disallowEmptySelection={true}
        selectedKeys={!!form.status ? [form.status]:[]}
        onSelectionChange={v => onChange(v.currentKey, 'status')}
      >
        {serviceStatuses.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            { item.label }
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Origen de fondo"
        labelPlacement="outside"
        placeholder="Seleccionar"
        variant="bordered"
        classNames={{ base: 'w-full sm:max-w-[10rem]', trigger: 'border-1' }}
        disallowEmptySelection={true}
        selectedKeys={!!form.funds_source_id ? [form.funds_source_id]:[]}
        onSelectionChange={v => onChange(v.currentKey, 'funds_source_id')}
      >
        {fundsSources.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            { item.label }
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Método de pago"
        labelPlacement="outside"
        placeholder="Seleccionar"
        variant="bordered"
        classNames={{ base: 'w-full sm:max-w-[10rem]', trigger: 'border-1' }}
        disallowEmptySelection={true}
        selectedKeys={!!form.payment_method_id ? [form.payment_method_id]:[]}
        onSelectionChange={v => onChange(v.currentKey, 'payment_method_id')}
      >
        {paymentMethods.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            { item.label }
          </SelectItem>
        ))}
      </Select>
      <Input
        type="date"
        classNames={{
          base: 'w-full sm:max-w-[10rem]',
          inputWrapper: 'border-1 h-10',
          input: `pr-0 text-${!!form.since ? '[]':'foreground-400'}`,
        }}
        label="Fecha de pago"
        labelPlacement="outside"
        placeholder=" "
        variant="bordered"
        value={form.since}
        onValueChange={v => onChange(v, 'since')}
      />
      <Input
        type="number"
        classNames={{
          base: 'w-full sm:max-w-[10rem]',
          inputWrapper: 'border-1 h-10',
        }}
        label="Monto"
        labelPlacement="outside"
        placeholder=" "
        step="0.01"
        variant="bordered"
        value={form.amount}
        onValueChange={v => onChange(v, 'amount')}
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

const ModalApprove = ({ item, onClose, onApprove }) => {
  const classes = {
    base: 'w-full',
    inputWrapper: 'border-1 h-10',
    label: 'text-xl font-semibold',
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Aprobar transacción</ModalHeader>
      <ModalBody className="grid grid-cols-3 gap-x-4 gap-y-8">
        <Input
          classNames={classes}
          label="Nombre"
          labelPlacement="outside"
          variant="bordered"
          value={item?.user?.name}
          readOnly
        />
        <Input
          classNames={classes}
          label="Origen de fondos"
          labelPlacement="outside"
          variant="bordered"
          value={item?.funds_source?.name}
          readOnly
        />
        <Input
          classNames={classes}
          label="Forma de pago"
          labelPlacement="outside"
          variant="bordered"
          value={item?.payment_method?.name}
          readOnly
        />
        <Input
          classNames={classes}
          label="Wallet"
          labelPlacement="outside"
          variant="bordered"
          value={item?.wallet ?? ' '}
          readOnly
        />
        <Input
          classNames={classes}
          label="Monto"
          labelPlacement="outside"
          variant="bordered"
          value={formatAmount(item.amount, '$')}
          readOnly
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onPress={onClose}>Cancelar</Button>
        <Button color="primary" onPress={onApprove}>Aprobar</Button>
      </ModalFooter>
    </>
  )
}

const ModalReject = ({ item, onClose, onReject }) => {
  const classNames = {
    base: 'w-full',
    inputWrapper: 'border-1 h-10',
    label: 'text-xl font-semibold',
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Rechazar transacción</ModalHeader>
      <ModalBody className="grid grid-cols-3 gap-x-4 gap-y-8">
        <Input
          classNames={classNames}
          label="Nombre"
          labelPlacement="outside"
          variant="bordered"
          value={item?.user?.name}
          readOnly
        />
        <Input
          classNames={classNames}
          label="Origen de fondos"
          labelPlacement="outside"
          variant="bordered"
          value={item?.funds_source?.name}
          readOnly
        />
        <Input
          classNames={classNames}
          label="Forma de pago"
          labelPlacement="outside"
          variant="bordered"
          value={item?.payment_method?.name}
          readOnly
        />
        <Input
          classNames={classNames}
          label="Wallet"
          labelPlacement="outside"
          variant="bordered"
          value={item?.wallet ?? ' '}
          readOnly
        />
        <Input
          classNames={classNames}
          label="Monto"
          labelPlacement="outside"
          variant="bordered"
          value={formatAmount(item.amount, '$')}
          readOnly
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onPress={onClose}>Cancelar</Button>
        <Button color="danger" onPress={onReject}>Rechazar</Button>
      </ModalFooter>
    </>
  )
}

const useFetchTable = () => {
  const initialFilters = {
    page: 1,
    perPage: Constants.PER_PAGE,
    search: '',
    status: '',
    since: null,
    until: null,
    payment_method_id: '',
    funds_source_id: '',
    amount: '',
  };

  const initialPagination = {
    page: 1,
    pages: 1,
    total: 0,
    perPage: Constants.PER_PAGE,
  };

  const [data, setData] = useState([]);
  const [fundsSources, setFundsSources] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [canFetch, setCanFetch] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(initialPagination);

  const debounceTime = 500;
  const debounce = useRef();

  const fetchData = async () => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      const response = await OrdersService.admin.findAll({ ...filters, until: filters.since });
      const { data, ...rest } = response;

      setData(data);
      setPagination(rest);
      setCanFetch(true);

    } catch (error) {
      setData([]);
      onError(String(error));
    }
  }

  const getSelects = async () => {
    try {
      Promise.all([
        GeneralService.findFundsSources(filters),
        GeneralService.findPaymentMethods(filters),
      ])
        .then(res => {
          setFundsSources(res[0].map(x => ({ value: x.id, label: x.name })));
          setPaymentMethods(res[1].sort((a,b) => a.order - b.order).map(x => ({ value: x.id, label: x.name })));
        })
        .catch(console.log);

    } catch (error) {
      onError(String(error));
    }
  }

  const approveItem = async (item) => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      const data = { id: item.id, status: Constants.ORDER.STATUS.APPROVED };
      await OrdersService.admin.update(data);
      toast.success('Transacción aprobada con éxito');
      Socket.emit(SocketEvents.ORDER.APPROVED, {
        user_id: item.user_id,
        order_id: item.id,
      });
      fetchData();

    } catch (error) {
      onError(String(error));
    }
    setCanFetch(true);
  }

  const rejectItem = async (item) => {
    if (!canFetch) return;
    setCanFetch(false);

    try {
      const data = { id: item.id, status: Constants.ORDER.STATUS.REJECTED };
      await OrdersService.admin.update(data);
      toast.success('Transacción rechazada con éxito');
      Socket.emit(SocketEvents.ORDER.REJECTED, {
        user_id: item.user_id,
        order_id: item.id,
      });
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

  useEffect(() => {
    getSelects();
  }, []);

  return {
    approveItem,
    canResetFilter: canResetFilter(),
    data,
    filterBy,
    filters,
    fundsSources,
    goToPage,
    isLoading: !canFetch,
    pagination,
    paymentMethods,
    rejectItem,
    reload,
  }
}

export default Services;
