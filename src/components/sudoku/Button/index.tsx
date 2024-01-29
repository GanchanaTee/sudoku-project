import React, { ReactNode } from 'react';

import styles from './Button.module.css';

interface ButtonProps {
  color: string;
  onClick: () => void;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ color, children, ...props }) => {
  return (
    <button className={styles.button} style={{ backgroundColor: color }} {...props}>
      {children}
    </button>
  );
};

export default Button;
