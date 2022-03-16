import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/form/Input';
import SingleSelect, { customStyles } from 'components/form/SingleSelect';
import { PurchaseRequestItem } from 'modules/purchaseRequest/entities';
import React from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import * as yup from 'yup';

import ModalBox from '..';

export interface PurchaseRequestItemModalProps {
  onSend: (data: PurchaseRequestItem) => void;
  classButton?: string;
  isEdit?: boolean;
  buttonTitle?: string;
  myItem?: PurchaseRequestItem;
  itemData: any;
}

const PurchaseRequestItemModal: React.FC<PurchaseRequestItemModalProps> = ({
  onSend,
  classButton,
  isEdit = false,
  buttonTitle,
  myItem,
  itemData,
}) => {
  const available = {
    qty: isEdit
      ? itemData.availableQty + myItem?.quantity
      : itemData.availableQty,
    priceUsd: isEdit
      ? itemData.availableUsd + myItem?.priceUsd
      : itemData.availableUsd,
  };
  const schema = yup.object().shape({
    item: yup.string().required(`Item can't be empty!`),
    description_2: yup.string().required(`Description 2 can't be empty!`),
    description_3: yup.string().required(`Description 3 can't be empty!`),
    description_4: yup.string().required(`Description 4 can't be empty!`),
    partNo: yup.string().required(`Part No can't be empty!`),
    mnemonic: yup.string().required(`Mnemonic can't be empty!`),
    uom: yup.string().required(`UOM can't be empty!`),
    quantity: yup
      .number()
      .typeError(`Quantity can't be empty!`)
      .required(`Quantity can't be empty!`)
      .min(1, 'Quantity must be greater than 0')
      .max(
        available.qty,
        `Item quantity can't be more than quantity required, available ${available.qty}`
      ),
    priceUsd: yup
      .number()
      .typeError(`Price (USD) can't be empty!`)
      .required(`Price (USD) can't be empty!`)
      .min(1, 'Price must be greater than 0')
      .max(
        available.priceUsd,
        `Price can't be more than estimated price, available ${available.priceUsd}`
      ),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<PurchaseRequestItem>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = (data: PurchaseRequestItem) => {
    data.description_1 = itemData.description1;
    onSend(data);
    reset({});
  };

  const onModalOpened = () => {
    if (isEdit) {
      reset({
        item: myItem?.item,
        description_2: myItem?.description_2,
        description_3: myItem?.description_3,
        description_4: myItem?.description_4,
        partNo: myItem?.partNo,
        mnemonic: myItem?.mnemonic,
        uom: myItem?.uom,
        quantity: myItem?.quantity,
        priceUsd: myItem?.priceUsd,
      });
    }
  };

  return (
    <ModalBox
      buttonTitle={buttonTitle || ''}
      buttonVariant="primary"
      wordingSubmit="Save"
      submitButtonVariant="primary"
      classButton={classButton}
      title={`${isEdit ? 'Edit' : 'Add'} Purchase Request Item`}
      dialogClassName="modal-90w"
      onSend={handleSubmit(handleSubmitForm)}
      isError={!isValid}
      onClikModal={onModalOpened}
    >
      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Item</FormLabel>
            <Input
              placeholder="Item"
              name="item"
              control={control}
              defaultValue=""
              type="text"
              error={errors.item?.message}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Description 1</FormLabel>
            <FormControl type="text" value={itemData.description1} disabled />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Description 2</FormLabel>
            <Input
              placeholder="Description 2"
              name="description_2"
              control={control}
              defaultValue=""
              type="text"
              error={errors.description_2?.message}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Description 3</FormLabel>
            <Input
              placeholder="Description 3"
              name="description_3"
              control={control}
              defaultValue=""
              type="text"
              error={errors.description_3?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Description 4</FormLabel>
            <Input
              placeholder="Description 4"
              name="description_4"
              control={control}
              defaultValue=""
              type="text"
              error={errors.description_4?.message}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Part No</FormLabel>
            <Input
              name="partNo"
              placeholder="Part No"
              control={control}
              defaultValue=""
              type="text"
              error={errors.partNo?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Mnemonic</FormLabel>
            <SingleSelect
              name="mnemonic"
              control={control}
              defaultValue=""
              placeholder="Mnemonic"
              options={itemData.mnemonicOptions}
              error={errors.mnemonic?.message}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">UOM</FormLabel>
            <SingleSelect
              name="uom"
              control={control}
              defaultValue=""
              placeholder="UOM"
              options={itemData.uomOptions}
              error={errors.uom?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Warranty</FormLabel>
            <Select
              instanceId="warranty"
              options={[{ label: 'NO', value: 'NO' }]}
              value={{ label: 'NO', value: 'NO' }}
              styles={{
                ...customStyles(),
                menu: () => ({
                  zIndex: 99,
                }),
              }}
              isDisabled
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Quantity</FormLabel>
            <Input
              name="quantity"
              placeholder="Quantity"
              control={control}
              defaultValue=""
              type="number"
              error={errors.quantity?.message}
            />
          </FormGroup>
        </Col>
        <Col lg={6}>
          <FormGroup>
            <FormLabel className="required">Price (USD)</FormLabel>
            <Input
              name="priceUsd"
              placeholder="Price (USD)"
              control={control}
              defaultValue=""
              type="number"
              error={errors.priceUsd?.message}
            />
          </FormGroup>
        </Col>
      </Row>
    </ModalBox>
  );
};

export default PurchaseRequestItemModal;
