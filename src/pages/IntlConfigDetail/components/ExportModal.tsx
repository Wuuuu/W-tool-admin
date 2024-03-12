import React, { useState } from 'react';
import { Select, Modal } from 'antd';

type ExportModalProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (val: string) => void;
};

const options = [
  { value: 'all', label: '全部' },
  { value: 'zh-CN', label: '中文' },
  { value: 'zh-TW', label: '中文（繁体）' },
  { value: 'en-US', label: '英语' },
  { value: 'ja', label: '日语' },
  { value: 'ko', label: '韩语' },
  { value: 'de', label: '德语' },
  { value: 'es', label: '西班牙语' },
  { value: 'pt', label: '葡萄牙语' },
  { value: 'id', label: '印尼语' },
  { value: 'fr', label: '法语' },
  // { value: 'ar', label: '阿拉伯语' },
  { value: 'hi', label: '印地语' },
  { value: 'bn', label: '孟加拉语' },
  { value: 'lo', label: '老挝语' },
  { value: 'vi', label: '越南语' },
];

const ExportModal: React.FC<ExportModalProps> = ({ visible, onCancel, onOk }) => {
  const [selectVal, setSelectVal] = useState('all');
  const handleOk = () => {
    onOk?.(selectVal);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleChange = (value: string) => {
    setSelectVal(value);
  };

  return (
    <div>
      <Modal title="导出数据" open={visible} onOk={handleOk} onCancel={handleCancel}>
        <div style={{ marginBottom: 32 }}>
          <span>导出语言：</span>
          <Select
            defaultValue={selectVal}
            style={{ width: 240 }}
            onChange={handleChange}
            options={options}
          />
        </div>
        <div>
          <span>导出格式：</span>
        </div>
      </Modal>
    </div>
  );
};

export default ExportModal;
