import React, { useEffect, useState } from "react";
import {  CircularProgress, Grid} from "@mui/material";
import "./styles.css";
import LeaveWidget from "../../components/widgets/LeaveWidget";
import { APIService } from "../../services/API";
import {
  LeaveBalance,
  formateLeaveBalance,
} from "../../utils/formateLeaveData";
import ApplyLeaveForm from "./ApplyLeave";
import ShadowBox from "../../components/ShadowBox";
import LeaveTable from "./LeaveTable";
import { LeaveEntry } from "../../services/Type";
import { useDispatch } from "react-redux";
import { showError, hideError } from "../../redux/actions/Info";

export type LeaveEntryType = {
  leaveId: string;
  name: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  leaveType: string;
  duration: string;
  status: string;
  dayCount: string;
  approverRemark: string;
};

export type LeaveType = {
  _id: string;
  title: string;
  defaultDays: number;
};

const Leave = () => {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>({});
  const [leavesData, setLeavesData] = useState<LeaveEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [leavesType, setLeavesType] = useState<LeaveType[]>([]);
  const dispatch= useDispatch()
  const fetchLeaveType = async () => {
    const leaveData = await APIService.getLeavesType();
    if (leaveData.statusCode == 7000) {
      setLeavesType(leaveData.data.leavesType);
    }
  };

  useEffect(() => {
    fetchLeaveType();
  }, []);

  const getData = async () => {
    setIsTableLoading(true);
    const res = await APIService.getLeaves();
    setIsTableLoading(false);

    if (res.statusCode == "7000") {
      const temp = res.data.leaves.map((item: LeaveEntry) => {
        return {
          leaveId: item._id,
          name: `${item.userId.name.first_name} ${item.userId.name.last_name}`,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          leaveType: item.leaveType.title,
          duration: item.leaveDuration,
          status: item.status,
          dayCount: item.dayCount,
          reason: item.reason,
          approverRemark: item.approverRemark
        };
      });
      setLeavesData(temp);
    }
  };

  const fectchLeaveBalance = async () => {
    setIsLoading(true);
    const res = await APIService.getLeaveBalance();
    setIsLoading(false);
    if (res.statusCode == "7000") {
      const formatedData = formateLeaveBalance(
        res.data?.leaveBalance?.leavesInfo
      );
      setLeaveBalance(formatedData);
    } else {
      dispatch(showError(res.message));
      setTimeout(() => {
        dispatch(hideError());
      }, 3000);
    }
  };

  useEffect(() => {
    getData();
    setIsLoading(true);
    fectchLeaveBalance();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (leaveBalance == undefined || Object.keys(leaveBalance).length === 0) {
    return <h1>Your leaves are not allocated yet</h1>;
  }

  return (
    <Grid container padding={2} spacing={2} justifyContent={"center"}>
      <Grid item xs={12} md={8}>
        <Grid
          container
          direction={{ xs: "row", sm: "column" }}
          spacing={2}
          height={"100%"}
        >
          <Grid item>
            <Grid
              container
              direction={"row"}
              spacing={1}
              alignContent={"center"}
              justifyContent={"start"}
            >
              <Grid item xs={12} sm={6}>
                <LeaveWidget
                  allocated={leaveBalance?.annual?.allocated}
                  taken={leaveBalance?.annual?.taken}
                  title={"Annual Leaves"}
                  color="#DCE000"
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LeaveWidget
                  allocated={leaveBalance?.sick?.allocated}
                  taken={leaveBalance?.sick?.taken}
                  title={"Sick Leaves"}
                  color="#E00D00"
                  isLoading={isLoading}
                />
              </Grid>
              {/* <Grid item>
                <LeaveWidget
                  allocated={leaveBalance?.compensatory?.allocated}
                  taken={leaveBalance?.compensatory?.taken}
                  title={"Compensatory Leaves"}
                  color="#3AE000"
                  isLoading={isLoading}
                />
              </Grid> */}
            </Grid>
          </Grid>
          <Grid item flexGrow={1} overflow={"auto"}>
            {isTableLoading ? (
              <CircularProgress />
            ) : (
              <LeaveTable
                leavesType={leavesType}
                leavesData={leavesData}
                setLeavesData={setLeavesData}
                fectchLeaveBalance={fectchLeaveBalance}
                getData={getData}
              />
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={4}>
        <ShadowBox>
          <ApplyLeaveForm
            leavesType={leavesType}
            getData={getData}
            fectchLeaveBalance={fectchLeaveBalance}
          />
        </ShadowBox>
      </Grid>
    </Grid>
  );
};

export default Leave;
