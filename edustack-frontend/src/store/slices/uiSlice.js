import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  theme: 'light',
  loading: false,
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
  dialog: {
    open: false,
    title: '',
    content: '',
    actions: [],
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    showDialog: (state, action) => {
      state.dialog = {
        open: true,
        title: action.payload.title,
        content: action.payload.content,
        actions: action.payload.actions || [],
      };
    },
    hideDialog: (state) => {
      state.dialog.open = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  showSnackbar,
  hideSnackbar,
  showDialog,
  hideDialog,
} = uiSlice.actions;

export default uiSlice.reducer;
