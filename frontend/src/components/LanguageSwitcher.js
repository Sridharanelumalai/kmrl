import React from 'react';
import { Button, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from '../i18n/translations';

const LanguageSwitcher = () => {
  const { changeLanguage, currentLanguage } = useTranslation();

  const items = [
    {
      key: 'en',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          🇺🇸 English
        </div>
      ),
      onClick: () => changeLanguage('en')
    },
    {
      key: 'ml',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          🇮🇳 മലയാളം
        </div>
      ),
      onClick: () => changeLanguage('ml')
    }
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button 
        icon={<GlobalOutlined />} 
        style={{ 
          background: 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white'
        }}
      >
        {currentLanguage === 'ml' ? 'മലയാളം' : 'English'}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;