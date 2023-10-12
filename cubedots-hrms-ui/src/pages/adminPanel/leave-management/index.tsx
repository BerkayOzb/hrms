import React, { useEffect, useState } from "react";
import LeaveBalance from "./LeaveBalance";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import LeaveRequest from "./LeaveRequest";
import { APIService } from "../../../services/API";
import { LeaveEntry } from "../../../services/Type";
import { modalStyle } from "../../profile/PersonalDetails";
import LeaveActionForm from "./LeaveActionForm";
import {
  LeaveBalance as leaveBalType,
  formateLeaveBalance,
} from "../../../utils/formateLeaveData";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch } from "react-redux";
import { showError, hideError } from "../../../redux/actions/Info";

export type LeaveRequestRecord = {
  leaveId: string;
  empCode: string;
  name: string;
  employeeCode: string;
  startDate: Date;
  endDate: Date;
  leaveType: string;
  duration: string;
  status: string;
  reason: string;
  dayCount: number;
  approverRemark: string;
};

type LeaveBalanceData = {
  leaveType: { title: string; _id: string };
  allocated: number;
  taken: number;
};

type LeaveBalanceEntryType = {
  leaveBalance: { leavesInfo: null | LeaveBalanceData[] };
  name: {
    first_name: string;
    last_name: string;
  };
};

export type LeaveBalanceType = {
  _id: string;
  name: string;
  leaveBalance: leaveBalType;
};

const LeaveManagement = () => {
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceType[]>([]);

  const [leaveRequest, setLeaveRequest] = useState<LeaveRequestRecord[]>([]);
  const [selecteLeaveRequest, setSelectedLeaveRequest] =
    useState<LeaveRequestRecord | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLeaveRequest(null);
  };

  const getLeaveRequestData = async () => {
    setRequestsLoading(true);

    const res = await APIService.getLeaveRequests();
    if (res.statusCode == "7000") {
      const temp = res.data.leaveRequest.map((item: LeaveEntry) => {
        return {
          leaveId: item._id,
          name: `${item.userId.name.first_name} ${item.userId.name.last_name}`,
          empCode: item.userId.employee_code,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          leaveType: item.leaveType.title,
          duration: item.leaveDuration,
          status: item.status,
          dayCount: item.dayCount,
          reason: item.reason,
          approverRemark: item.approverRemark,
        };
      });
      setLeaveRequest(temp);
    }
    setRequestsLoading(false);
  };

  const getLeaveBalance = async () => {
    setBalanceLoading(true);
    const res = await APIService.getUsersLeaveBalance();
    if (res.statusCode == "7000") {
      const formatedData = res.data.usersWithLeaveBalances.map(
        (data: LeaveBalanceEntryType) => {
          return data?.leaveBalance?.leavesInfo
            ? {
                ...data,
                name: `${data.name.first_name} ${data.name.last_name}`,

                leaveBalance: formateLeaveBalance(
                  data?.leaveBalance?.leavesInfo
                ),
              }
            : {
                ...data,
                name: `${data.name.first_name} ${data.name.last_name}`,
                leaveBalance: {
                  annual: { allocated: 0, taken: 0 },
                  sick: { allocated: 0, taken: 0 },
                  compensatory: { allocated: 0, taken: 0 },
                },
              };
        }
      );
      setLeaveBalance(formatedData);
    } else {
      dispatch(showError(res.message));
      setTimeout(() => {
        dispatch(hideError());
      }, 3000);
    }
    setBalanceLoading(false);
  };

  useEffect(() => {
    getLeaveBalance();
    getLeaveRequestData();
  }, []);

  return (
    <>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid item xs={12} sm={12} md={10}>
          <Typography variant="h6" component="h2">
            Leave Balance of Employees
          </Typography>
          {balanceLoading ? (
            <CircularProgress />
          ) : (
            <LeaveBalance
              leaveBalance={leaveBalance}
              getLeaveBalance={getLeaveBalance}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <Typography variant="h6" component="h2">
            Leave Request Of Employees
          </Typography>
          {requestsLoading ? (
            <CircularProgress />
          ) : (
            <LeaveRequest
              leaveRequest={leaveRequest}
              handleCloseModal={handleCloseModal}
              handleOpenModal={handleOpenModal}
              setSelectedLeaveRequest={setSelectedLeaveRequest}
            />
          )}
        </Grid>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Button
            onClick={handleCloseModal}
            style={{ position: "absolute", right: "0%" }}
          >
            <CancelIcon />
          </Button>
          {selecteLeaveRequest != null && (
            <LeaveActionForm
              leave={selecteLeaveRequest}
              getLeaveRequestData={getLeaveRequestData}
              handleCloseModal={handleCloseModal}
              getLeaveBalance={getLeaveBalance}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default LeaveManagement;
