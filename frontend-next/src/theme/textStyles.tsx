// This file defines the text styles used in the application.

type TextStyles = {
    heading: React.CSSProperties;
    subheading: React.CSSProperties;
    body: React.CSSProperties;
    navLink: React.CSSProperties;
    dropdownItem: React.CSSProperties;
    error: React.CSSProperties;
};
  
const textStyles: TextStyles = {
    heading: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: '2.5rem',
    },
    subheading: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: '2rem',
    },
    body: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '2rem',
    },
    navLink: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
      fontSize: '1.125rem',
      lineHeight: '1.5rem',
      color: '#FFFFFF',
      textDecoration: 'none',
      transition: 'color 0.3s',
    },
    dropdownItem: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      padding: '10px 20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    error: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      color: '#FF0000',
    },
};
  
export default textStyles;
