import React, { useState } from 'react';
import { Modal, Platform } from 'react-native';
import { Button } from '../Button';
import { Close } from '../Icons/Close';
import { Text } from '../Text';
import {
  Overlay,
  ModalBody,
  Header,
  TouchableIcon,
  Input,
  Form
} from './styles';

interface PropsModalTable {
  visible:boolean;
  onClose:() => void;
  onSave:(table) => void;
}

export function TableModal({ visible, onClose, onSave}: PropsModalTable){
  const [table, setTable] = useState('');

  function handleSave(){
    setTable('');
    onSave(table);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
    >
      <Overlay behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
        <ModalBody>
          <Header>
            <Text weight="600">Informe a mesa</Text>

            <TouchableIcon onPress={() => onClose()}>
              <Close color="#666"/>
            </TouchableIcon>
          </Header>
          <Form>
            <Input
              placeholder="Número da mesa:"
              placeholderTextColor="#666"
              onChangeText={setTable}
              keyboardType="number-pad"
            />

            <Button
              title="Salvar"
              onPress={handleSave}
            />
          </Form>
        </ModalBody>
      </Overlay>
    </Modal>
  );
}
