import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { Machine } from '../../services/mockDataService';

interface MachineFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (machine: Partial<Machine>) => void;
  machine?: Machine;
  projectId?: string;
  title: string;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Le nom est requis')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
  description: yup
    .string()
    .max(500, 'La description ne doit pas dépasser 500 caractères'),
  model: yup
    .string()
    .required('Le modèle est requis'),
  serialNumber: yup
    .string()
    .required('Le numéro de série est requis'),
  manufacturer: yup
    .string()
    .required('Le fabricant est requis'),
  yearOfManufacture: yup
    .number()
    .required('L\'année de fabrication est requise')
    .integer('L\'année doit être un nombre entier')
    .min(1900, 'L\'année ne peut pas être antérieure à 1900')
    .max(new Date().getFullYear(), `L'année ne peut pas être supérieure à ${new Date().getFullYear()}`),
  status: yup
    .string()
    .oneOf(['operational', 'maintenance', 'offline'], 'Statut invalide')
    .required('Le statut est requis'),
});

const MachineForm: React.FC<MachineFormProps> = ({
  open,
  onClose,
  onSave,
  machine,
  projectId,
  title
}) => {
  const initialValues: Partial<Machine> = machine 
    ? { ...machine }
    : {
        name: '',
        description: '',
        model: '',
        serialNumber: '',
        manufacturer: '',
        yearOfManufacture: new Date().getFullYear(),
        status: 'operational',
        lastMaintenanceDate: new Date().toISOString(),
        projectId: projectId || ''
      };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: { overflowY: 'visible' } }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nom de la machine"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <InputLabel id="status-label">Statut</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Statut"
                >
                  <MenuItem value="operational">En fonctionnement</MenuItem>
                  <MenuItem value="maintenance">En maintenance</MenuItem>
                  <MenuItem value="offline">Hors ligne</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="manufacturer"
                name="manufacturer"
                label="Fabricant"
                value={formik.values.manufacturer}
                onChange={formik.handleChange}
                error={formik.touched.manufacturer && Boolean(formik.errors.manufacturer)}
                helperText={formik.touched.manufacturer && formik.errors.manufacturer}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="model"
                name="model"
                label="Modèle"
                value={formik.values.model}
                onChange={formik.handleChange}
                error={formik.touched.model && Boolean(formik.errors.model)}
                helperText={formik.touched.model && formik.errors.model}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="serialNumber"
                name="serialNumber"
                label="Numéro de série"
                value={formik.values.serialNumber}
                onChange={formik.handleChange}
                error={formik.touched.serialNumber && Boolean(formik.errors.serialNumber)}
                helperText={formik.touched.serialNumber && formik.errors.serialNumber}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="yearOfManufacture"
                name="yearOfManufacture"
                label="Année de fabrication"
                type="number"
                value={formik.values.yearOfManufacture}
                onChange={formik.handleChange}
                error={formik.touched.yearOfManufacture && Boolean(formik.errors.yearOfManufacture)}
                helperText={formik.touched.yearOfManufacture && formik.errors.yearOfManufacture}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="lastMaintenanceDate"
                name="lastMaintenanceDate"
                label="Dernière maintenance"
                type="date"
                value={formik.values.lastMaintenanceDate ? new Date(formik.values.lastMaintenanceDate).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const value = e.target.value ? new Date(e.target.value).toISOString() : '';
                  formik.setFieldValue('lastMaintenanceDate', value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {machine ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MachineForm;
