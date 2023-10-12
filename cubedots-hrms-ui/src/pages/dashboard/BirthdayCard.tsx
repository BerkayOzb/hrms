import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Avatar, Stack } from "@mui/material";
type BirthdayCardProps = {
  name: {
    first_name: string;
    last_name: string;
  };
  date: string;
  id: string;
  age?: string;
};


function getYearDifference(date1: string | Date, date2: string | Date): number {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);

  const diffMilliseconds = Math.abs(dateObj2.getTime() - dateObj1.getTime());

  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
  const diffYears = diffMilliseconds / millisecondsInYear;

  return Math.ceil(diffYears);
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ name, date, id, age}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Stack alignItems={"center"}>
          <Avatar
            src={`${
              process.env.REACT_APP_API_URL
            }/uploads/profiles/${id}?${new Date().getTime()}`}
            alt={`${name?.first_name}`}
            style={{
              width: "120px",
              height: "120px",
              marginBottom: "16px",
            }}
          />
          <Typography gutterBottom  variant="h5" component="div">
            {`${name.first_name} ${name.last_name}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(date).toDateString()}
          </Typography>
          {age && <Typography variant="body2" color="text.secondary">
            {`Completing ${getYearDifference(date, age)} years in Cubedots`}
          </Typography>}
        </Stack> 
      </CardContent>
    </Card>
  );
};

export default BirthdayCard;
