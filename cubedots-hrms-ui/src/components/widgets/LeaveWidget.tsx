import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import "./styles.css";
import { ConstructionOutlined } from "@mui/icons-material";

export type LeaveWidgetProps = {
  allocated: number;
  taken: number;
  title: string;
  color: string;
  isLoading?: boolean;
};

const LeaveWidget: React.FC<LeaveWidgetProps> = ({
  allocated,
  taken,
  title,
  color = "red",
  isLoading,
}) => {
  const takenPer = Math.round(
    ((taken <= allocated ? taken : allocated) / allocated) * 100
  );
  const percentage = taken == 0 ? 0 : takenPer;
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <Box className="leaveWidgetConatiner">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Stack alignItems={"center"} justifyContent={"space-between"}>
          <Typography variant="h6" component="h6">
            {title}
          </Typography>
          <svg width="150" height="150" viewBox="-10 -10 140 140">
            <defs>
              <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                <feBlend in="SourceGraphic" mode="normal" />
              </filter>
            </defs>

            <g filter="url(#f1)">
              {" "}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="15"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                transform="rotate(-90, 60, 60)"
              />
              <text
                x="45%"
                y="50%"
                textAnchor="middle"
                // dy=".1em"
                fontSize="20"
                fill="#000"
              >
                {`${percentage}%`}
              </text>
            </g>
          </svg>
          <Grid
            container
            direction={"row"}
            textAlign={"center"}
            sx={{ borderTop: "1px solid #7E7E7E4D" }}
          >
            <Grid
              item
              xs={4}
              sx={{ borderRight: "1px solid #7E7E7E4D", padding: "5px" }}
            >
              <Typography>{allocated}</Typography>
              <Typography>Eligible</Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ borderRight: "1px solid #7E7E7E4D", padding: "5px" }}
            >
              <Typography>{taken}</Typography>
              <Typography>Consumed</Typography>
            </Grid>
            <Grid item xs={4} sx={{ padding: "5px" }}>
              <Typography>{allocated - taken}</Typography>
              <Typography>Available</Typography>
            </Grid>
          </Grid>
        </Stack>
      )}
    </Box>
  );
};

export default LeaveWidget;
