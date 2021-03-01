import React, { FC } from "react";
import AppBarComponent from "../components/appbar/appbar";
import { makeStyles, Theme, Typography, Grid } from "@material-ui/core";
import {
  UserBloc,
  UserRepository,
  UserState,
  UserReadEvent,
  UserReadState,
  UserUpdateState,
  UserErrorState,
} from "@area-common/blocs";
import { gray } from "@area-common/styles";
import { DefaultState } from "../components/blocbuilder/default-state";
import { ErrorState } from "../components/blocbuilder/error-state";
import { User } from "@area-common/types";
import { BlocBuilder } from "@felangel/react-bloc";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    backgroundColor: gray.main,
  },
  title: {
    marginLeft: 125,
    marginTop: 40,
    color: gray.light2,
    fontSize: 30,
    textDecoration: "underline",
    textUnderlinePosition: "under",
  },
  settings: {
    marginTop: 25,
    justifyContent: "center",
  },
}));

const SettingsPage: FC = () => {
  const userBloc = new UserBloc(new UserRepository(""));
  userBloc.add(new UserReadEvent("3dcf9a69-e258-4449-a41d-cea7f6ca3fa9"));

  return (
    <BlocBuilder
      bloc={userBloc}
      key={uuidv4()}
      condition={(_, current: UserState) => {
        if (current instanceof UserUpdateState) {
          userBloc.add(
            new UserReadEvent("3dcf9a69-e258-4449-a41d-cea7f6ca3fa9")
          );
        }
        return true;
      }}
      builder={(state: UserState) => {
        if (state instanceof UserErrorState) {
          return <ErrorState errorLabel={"An error has occured"} />;
        }
        if (state instanceof UserReadState) {
          return <Settings user={(state as UserReadState).user} />;
        }
        return <DefaultState />;
      }}
    />
  );
};

type Props = {
  user: User;
};

const Settings: FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <>
      <AppBarComponent />
      <div className={classes.content}>Plop</div>
    </>
  );
};

export default SettingsPage;
