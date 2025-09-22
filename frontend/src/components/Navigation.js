import React from 'react';
import { Menu } from 'antd';
import { DashboardOutlined, ControlOutlined, CarOutlined, HistoryOutlined } from '@ant-design/icons';
import { theme } from '../styles/theme';
import { useTranslation } from '../i18n/translations';

const Navigation = ({ currentPath, onNavigate }) => {
  const { t } = useTranslation();
  
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t('dashboard'),
    },
    {
      key: '/induction-plan',
      icon: <ControlOutlined />,
      label: t('inductionPlan'),
    },
    {
      key: '/train-management',
      icon: <CarOutlined />,
      label: t('trainManagement'),
    }
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[currentPath]}
      onClick={({ key }) => onNavigate(key)}
      items={menuItems}
      style={{
        background: 'white',
        borderBottom: `2px solid ${theme.colors.neutral[200]}`,
        padding: `0 ${theme.spacing.md}px`,
        boxShadow: theme.shadows.sm
      }}
    />
  );
};

export default Navigation;