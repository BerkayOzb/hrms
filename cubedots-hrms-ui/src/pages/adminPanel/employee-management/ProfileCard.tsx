import React from "react";
import { Card, CardContent, Typography, Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { selectUser } from "../../../redux/actions/Users";
import AddIcon from "@mui/icons-material/Add";

interface ProfileProps {
  imageUrl?: string;
  name: string;
  designation?: string;
  userId?: string;
  handleOpenModel?: () => void;
}

const ProfileCard: React.FC<ProfileProps> = ({
  imageUrl,
  name,
  designation,
  userId,
  handleOpenModel,
}) => {
  const dispatch = useDispatch();

  return (
    <Card
      style={{
        width: "250px",
        height:"270px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
      }}
    >
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!handleOpenModel ? (
          <Avatar
            src={imageUrl}
            alt={name}
            style={{ width: "130px", height: "130px", marginBottom: "16px" }}
            onClick={() => {
              dispatch(selectUser(userId));
            }}
          />
        ) : (
          <Avatar
            alt={name}
            style={{ width: "130px", height: "130px", marginBottom: "16px" }}
            onClick={handleOpenModel}
          >
            <AddIcon />
          </Avatar>
        )}
        <Typography
          variant="h6"
          color={"primary"}
          sx={{ textTransform: "capitalize" }}
        >
          {name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {designation}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
