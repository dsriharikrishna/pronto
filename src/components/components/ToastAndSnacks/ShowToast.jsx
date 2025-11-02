import { toast, Bounce } from 'react-toastify';

const styles = {
  position: "top-right",
  autoClose: 1000,
  // hideProgressBar: false,
  newestOnTop:false,
  rtl:false,
  // pauseOnFocusLoss,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

const closeButton = ({ closeToast }) => (
  <button
    onClick={closeToast}
    style={{
      fontSize: "1rem",
      padding: "5px",
      marginLeft: "auto",
      color: "gray",
      width: "30px",
      top: "5px",
      right: "5px",
      cursor: "pointer",
      background: "transparent",
      border: "none",
    }}
  >
    ✖
  </button>
);

export const ShowToast = (type, msg) => {
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
  };

  (toastTypes[type] || toast)(msg, { ...styles, closeButton, autoClose: 3000 });
};