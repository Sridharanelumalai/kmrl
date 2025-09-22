import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { theme } from '../styles/theme';

const LoadingSpinner = ({ size = 'default', tip = 'Loading...' }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 24 : 16, color: theme.colors.primary }} spin />;
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: theme.spacing.lg,
      minHeight: '200px'
    }}>
      <Spin indicator={antIcon} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;