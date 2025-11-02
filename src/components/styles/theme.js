import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#fff',
    },
    text: {
      primary: '#333',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
  },
  components: {
    // Global CSS reset
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // margin: 0,
          // padding: 0,
          backgroundColor: '#fff',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },

    // Button
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          boxShadow: 'none',
          fontSize: '14px',
        },
      },
    },

    // TextField
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       // marginBottom: '12px',
    //     },
    //   },
    // },

    // Select
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: '0px',
          // padding: '6px 12px',
          fontSize: '13px',
        },
      },
    },

    // MenuItem
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '13px',
        },
      },
    },

    // InputLabel
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '13px',
        },
      },
    },

    // OutlinedInput
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontSize: '13px',
        },
      },
    },

    // Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          // padding: '20px',
          borderRadius: '4px',
        },
      },
    },

    // Typography
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#333',
        },
      },
    },

    // Table Cell
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          padding: '8px',
        },
      },
    },

    // Checkbox
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '4px',
        },
      },
    },

    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          // padding: '16px',
          borderRadius: '4px',
        },
      },
    },

    // Card
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },

    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },

    // Tabs
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '48px',
        },
        indicator: {
          height: '3px',
        },
        padding:0,
        margin:0,
      },
    },

    // Tab
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: '48px',
        },
      },
    },

    // Tooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '12px',
        },
      },
    },

    // IconButton
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '8px',
        },
      },
    },
  },
});

export default theme;
