import {
  ModalForm,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import _isEmpty from 'lodash/isEmpty';

type ContentFormRef = {
  // setContentFieldsValue: (values: any) => void;
};

type AddSubCategoryContentModalProps = {
  type: 'add' | 'update';
  visible: boolean;
  // ref: ContentFormRef;
  onOk: (value: Record<string, any>) => void;
  onOpenChange: (open: boolean) => void;
};

const AddSubCategoryContentModal: React.ForwardRefRenderFunction<
  ContentFormRef,
  AddSubCategoryContentModalProps
> = ({ type, visible, onOk, onOpenChange }, ref) => {
  const contentFormRef = useRef<ProFormInstance>();

  const [updateItemDataId, setUpdateItemDataId] = useState<string>('');

  const onFill = (values: Record<string, any>) => {
    contentFormRef?.current?.setFieldsValue(values);
    setUpdateItemDataId(values._id);
  };

  const onNeedReset = () => {
    const result = contentFormRef?.current?.getFieldsValue();
    if (!_isEmpty(result)) {
      contentFormRef?.current?.resetFields();
      setUpdateItemDataId('');
    }
  };

  useImperativeHandle(ref, () => ({
    onFill,
  }));

  useEffect(() => {
    // 状态为新增时，判断当前form数据是否为空，不为空，即之前因为更新操作的数据存留。需要清空
    if (type === 'add') {
      onNeedReset();
    }
  }, [type]);

  const modalTypeStr = { add: '新增', update: '更新' }[type];
  return (
    <ModalForm
      title={`${modalTypeStr}子类别内容`}
      formRef={contentFormRef}
      layout="horizontal"
      width="500px"
      open={visible}
      onOpenChange={onOpenChange}
      onFinish={async (values) => {
        if (type === 'update') {
          values.questionId = updateItemDataId;
        }
        onOk?.(values);
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '请输入标题',
          },
        ]}
        label="标题"
        width="lg"
        name="title"
      />
      <ProFormTextArea
        name="content"
        label="内容"
        width="lg"
        rules={[
          {
            required: true,
            message: '内容不能为空',
          },
        ]}
        placeholder="请输入内容"
        // fieldProps={inputTextAreaProps}
      />
    </ModalForm>
  );
};

export default forwardRef(AddSubCategoryContentModal);
