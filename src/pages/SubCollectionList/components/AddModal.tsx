import { ModalForm, ProFormText } from '@ant-design/pro-components';

type AddSubCategoryModalProps = {
  visible: boolean;
  onOk: (value: Record<string, any>) => void;
  // onCancel: () => void;
  onOpenChange: (open: boolean) => void;
};

const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = ({
  visible,
  onOk,
  onOpenChange,
}) => {
  return (
    <ModalForm
      title={'新增子类别'}
      // formRef={modalFormRef}
      layout="horizontal"
      width="500px"
      open={visible}
      onOpenChange={onOpenChange}
      onFinish={async (value) => {
        onOk?.(value);
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '请输入子类别名称',
          },
        ]}
        label="子类别名字"
        width="md"
        name="subCategoryName"
      />
    </ModalForm>
  );
};

export default AddSubCategoryModal;
