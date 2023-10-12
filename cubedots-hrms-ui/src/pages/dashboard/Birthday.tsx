import React, { useEffect, useState } from "react";
import {
  ButtonBase,
  Paper,
  CircularProgress,
} from "@mui/material";
import { APIService } from "../../services/API";
import BirthdayCard from "./BirthdayCard";
import DashboardCard from "../../components/card/DashboardCard";
import { useDispatch } from "react-redux";
import { showError, hideError } from "../../redux/actions/Info";

const IncomingBirthdays = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const getBirthday = async () => {
    const res = await APIService.getUpcomingBirthdays();
    setIsLoading(false);
    if (res.statusCode == "7000") {
      setSlides(res.data.users);
    } else {
      dispatch(showError(res.message));
      setTimeout(() => {
        dispatch(hideError());
      }, 3000);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getBirthday();
  }, []);

  const handleDotClick = (index: number) => {
    setActiveStep(index);
  };

  return (
    <DashboardCard title="Birthday" isLoading={isLoading}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper
            square
            elevation={0}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <ButtonBase style={{ height: "100%", width: "100%" }}>
              {slides.length > 0 && (
                <BirthdayCard
                  key={activeStep}
                  name={slides[activeStep]?.name}
                  date={slides[activeStep]?.birthdayThisYear}
                  id={slides[activeStep]?._id}
                />
              )}
            </ButtonBase>
          </Paper>

          <div>
            {slides.map((_, index) => (
              <span
                key={index}
                onClick={() => handleDotClick(index)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: activeStep === index ? "#E45725" : "#ccc",
                  display: "inline-block",
                  margin: "0 5px",
                  cursor: "pointer",
                }}
              ></span>
            ))}
          </div>
        </>
      )}
    </DashboardCard>
  );
};

export default IncomingBirthdays;
