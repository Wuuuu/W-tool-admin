import React from 'react';
import { Button, Empty } from 'antd';

type EmptyProps = {
  image?: string;
  imageStyle?: React.CSSProperties;
  description?: React.ReactNode;
  buttonText?: string;
  buttonClick?: () => void;
};

const EmptyPage: React.FC<EmptyProps> = ({
  image,
  imageStyle,
  description,
  buttonText,
  buttonClick,
}) => (
  <Empty
    image={image || 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'}
    imageStyle={imageStyle || { height: 60 }}
    description={description}
  >
    {buttonText && (
      <Button type="primary" onClick={buttonClick}>
        {buttonText}
      </Button>
    )}
  </Empty>
);

export default EmptyPage;
