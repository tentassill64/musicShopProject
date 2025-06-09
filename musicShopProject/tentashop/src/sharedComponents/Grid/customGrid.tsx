import React from 'react';
import { styled } from '@mui/material/styles';

type GridProps = {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  spacing?: number;
  component?: React.ElementType; // Добавляем поддержку component
  children: React.ReactNode;
  sx?: React.CSSProperties; // Добавляем поддержку sx (опционально)
};

const StyledDiv = styled('div')({
  boxSizing: 'border-box',
});

const CustomGrid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ container = false, item = false, xs, sm, md, lg, spacing = 0, children }, ref) => {
    const getFlexBasis = () => {
      if (xs) return `${(xs / 12) * 100}%`;
      if (sm) return `${(sm / 12) * 100}%`;
      if (md) return `${(md / 12) * 100}%`;
      if (lg) return `${(lg / 12) * 100}%`;
      return '100%';
    };

const styles: React.CSSProperties = {
      ...(container && {
        display: 'flex',
        flexWrap: 'wrap' as const, // Явное приведение типа
        margin: `-${spacing / 2}px`,
        width: `calc(100% + ${spacing}px)`,
      }),
      ...(item && {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: getFlexBasis(),
        maxWidth: getFlexBasis(),
        padding: `${spacing / 2}px`,
      }),
    };

    return (
      <StyledDiv ref={ref} style={styles}>
        {children}
      </StyledDiv>
    );
  }
);

export default CustomGrid;