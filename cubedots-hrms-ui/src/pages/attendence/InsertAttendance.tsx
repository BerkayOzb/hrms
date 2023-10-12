import {
  Stack,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState } from "react";
import {
  loading,
  notLoading,
  showMessage,
  hideMessage,
  showError,
  hideError,
} from "../../redux/actions/Info";
import { APIService } from "../../services/API";
import { useDispatch, useSelector } from "react-redux";

const InsertAttendance = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dayType, setDayType] = useState('FD')  // FD:FullDay HD:HalfDay H:holiday WO: weeklyoff
  //   const [isLoading, setIsLoading] = useState(false);
  const info = useSelector((state: any) => state.info);

  const dispatch = useDispatch();
  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event?.target?.files?.[0] as File);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      dispatch(loading());
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("dayType",dayType);
      const res = await APIService.insertAttendance(formData);
      dispatch(notLoading());
      if (res.statusCode == "7000") {
        setSelectedFile(null);
        dispatch(showMessage(res.message));
        setTimeout(() => dispatch(hideMessage()), 3000);
      } else {
        dispatch(showError(res.message));
        setTimeout(() => dispatch(hideError()), 3000);
      }
    }
  };

  const handleDayChange = (e: SelectChangeEvent<string>) => {
    setDayType(e.target.value);
  };

  return (
    <Stack spacing={2}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography sx={{ fontWeight: "bold" }}>
          Upload Attendance Data
        </Typography>
      </Stack>
      <FormControl>
        <InputLabel>Select Day Type</InputLabel>
        <Select
          value={dayType}
          onChange={handleDayChange}
          label="Select Day Type"
          sx={{textAlign:"left"}}
        >
          <MenuItem value="FD">Full Day</MenuItem>
          <MenuItem value="HD">Half Day</MenuItem>
          <MenuItem value="WO">Weekly Off</MenuItem>
          <MenuItem value="H">Holiday</MenuItem>
        </Select>
      </FormControl>
      <input
        accept=".xls, .xlsx"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleSelectFile}
      />
      <Stack direction={"row"} spacing={1}>
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Select File
          </Button>
        </label>
        <Button
          variant="contained"
          component="span"
          disabled={selectedFile == null}
          onClick={handleUpload}
          startIcon={info.loading ? <CircularProgress size={20} /> : null}
        >
          Upload
        </Button>
      </Stack>
      {selectedFile && selectedFile?.name}
    </Stack>
  );
};

export default InsertAttendance;
