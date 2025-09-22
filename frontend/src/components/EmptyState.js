import React from 'react';
import { Empty, Button } from 'antd';
import { theme } from '../styles/theme';

const EmptyState = ({ 
  title = 'No Data Available', 
  description = 'There is no data to display at the moment.',
  actionText,
  onAction,
  icon
}) => {
  return (
    <div style={{ 
      padding: theme.spacing.xl,
      textAlign: 'center',
      background: theme.colors.neutral[50],
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.neutral[200]}`
    }}>
      <Empty
        image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <h3 style={{ ...theme.typography.h3, color: theme.colors.neutral[600], marginBottom: theme.spacing.xs }}>
              {title}
            </h3>
            <p style={{ ...theme.typography.body, color: theme.colors.neutral[500] }}>
              {description}
            </p>
          </div>
        }
      >
        {actionText && onAction && (
          <Button 
            type="primary" 
            onClick={onAction}
            style={{
              background: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderRadius: theme.borderRadius.md
            }}
          >
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;