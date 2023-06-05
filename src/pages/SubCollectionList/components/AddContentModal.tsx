import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

type AddSubCategoryContentModalProps = {
  visible: boolean;
  onOk: (value: Record<string, any>) => void;
  onOpenChange: (open: boolean) => void;
};

const AddSubCategoryContentModal: React.FC<AddSubCategoryContentModalProps> = ({
  visible,
  onOk,
  onOpenChange,
}) => {
  return (
    <ModalForm
      title="新增子类别内容"
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
            message: '请输入内容标题',
          },
        ]}
        label="内容标题"
        width="md"
        name="title"
      />
      <ProFormTextArea
        name="content"
        label="内容"
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

export default AddSubCategoryContentModal;
